// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';


//messages OK
//input OK
//output OK
//phrases OK
//displayname

/**
 * List of all intents in the specified project.
 * @param {string} projectId The project to be used
 */

  // [START dialogflow_list_intents]
  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  // const projectId = 'The Project ID to use, e.g. 'YOUR_GCP_ID';

  // Imports the Dialogflow library
  const dialogflow = require('dialogflow');
const { search } = require('./dialogflow');

  // Instantiates clients
  const intentsClient = new dialogflow.IntentsClient();

exports.listIntents = async (req, res) => {
  try {
    // Construct request

    const intentsClient = new dialogflow.IntentsClient();
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const projectAgentPath = intentsClient.projectAgentPath(projectId);

    const request = {
      parent: projectAgentPath,
      intentView: 'INTENT_VIEW_FULL',
    }

    let existingIntent = "";

    const [response] = await intentsClient.listIntents(request);
    response.sort((a, b) => {
      var nameA = a.displayName.toUpperCase(); // ignore upper and lowercase
      var nameB = b.displayName.toUpperCase(); // ignore upper and lowercase
      if (nameA > nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }

      // 이름이 같을 경우
      return 0;
    });
    let trainingPhrases = {};
    let messageTexts = {};
    let inputContexts = {};
    let outputContext = {};
    let childDegree = {};
    let result = [];
    let childCardinality = {};
    let cardinalCount = 0;
    let cardinalityNum = [];

    response.forEach((intent)=> {
      //phrase listing==================================
      intent.trainingPhrases.forEach((phrase) => {
        let trainingPhrasesPart = [];
        phrase.parts.forEach((element) => {
          trainingPhrasesPart.push(element.text);
        })
        if(!trainingPhrases[intent.displayName]){
          trainingPhrases[intent.displayName] = [trainingPhrasesPart];
        }else{
          trainingPhrases[intent.displayName].push(trainingPhrasesPart);
        }
      })

      //message listing==================================
      
      intent.messages.forEach((message) => {
        const instantMessageTextArray = message.text.text;
        let gatheredTexts = [];
        
        instantMessageTextArray.forEach((each) => {
          gatheredTexts.push([each]);
        })
        if(!messageTexts[intent.displayName]){
          messageTexts[intent.displayName] = gatheredTexts;
        }else{
          messageTexts[intent.displayName].push(gatheredTexts);
        }
      })


      //
      let cardinalCount = 0;
      if(intent.displayName.includes(' - custom')){
        
        let temp = intent.displayName.toString().substr(intent.displayName.length-1, 1);
        let displayNameWithoutNum;
        if (!isNaN(temp)) {  //끝에 숫자가 있다면
          displayNameWithoutNum = intent.displayName.slice(0, intent.displayName.length - 2)
          
        } else {
          displayNameWithoutNum = intent.displayName;
        }
        cardinalCount++;
        //search parent
        let parentIntentDisplayName = displayNameWithoutNum.slice(0, -9);

        if(!childCardinality[parentIntentDisplayName]){
          childCardinality[parentIntentDisplayName] = ['1'];
        }else{
          childCardinality[parentIntentDisplayName].push('1');
        }

      }
      
      var count = intent.displayName.match(/custom/g);
      if(count != null) {
        childDegree[intent.displayName] = count.length;
      }

      //자식이 없는 인텐트의 card num을 0으로 채움
      
      if(!childCardinality[intent.displayName]){
        cardinalityNum[intent.displayName] = 0;
      }else{
        cardinalityNum[intent.displayName] = childCardinality[intent.displayName].length;
      }

      result.push({
        intentName: intent.displayName,
        trainingPhrases: trainingPhrases[intent.displayName],
        messageTexts: messageTexts[intent.displayName],
        inputContexts: inputContexts[intent.displayName],
        outputContext: outputContext[intent.displayName],
        childDegree: childDegree[intent.displayName],
        cardinalityNum: cardinalityNum[intent.displayName],
      });
    })
   // console.log(cardinalityNum);
    result.sort((a, b) => {
      var nameA = a.intentName.toUpperCase(); // ignore upper and lowercase
      var nameB = b.intentName.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // 이름이 같을 경우
      return 0;
    });

    let childIntents = [];
    //for문안에서 순회하며 호출
    const searchChild = (intentArray, childIntents, index, childIndex, degree) =>{
      if(!intentArray[index].outputContext){  //자식이 없다면
        console.log(childIntents);
        return childIntents[intentArray[index].displayName].push(intentArray[index]); //부모 - 자식
      }else{  //자식이 있다면
        let parentIntent = intentArray[index];
        for(let i = 0; i < intentArray.length; i++){  //let intent in intentArray
          //console.log(parentIntent);
          let childIntent = intentArray[i];
          if(parentIntent.outputContext === childIntent.inputContexts){
            if(!childIntents[parentIntent.displayName]){
              childIntents[parentIntent.displayName] = childIntent;
            }else{
              //childIntents.push(childIntent);
            }
            //intentArrayWithChild.splice(i, 1);
          }
          
        }
        return searchChild(intentArray, childIntents, ++index, childIndex, degree); //[parentIntent.displayName]
      }


      let childArray = [];
      for(let i = index; i < intentArray.length; i++){
        if(intentArray[i].inputContexts === parentIntent.outputContext){
          childArray.push(intentArray[i]);
        }
      }
      return childArray;
    }

    res.send({
      result: result});
    
}catch(error){
  console.log(error);
}
}