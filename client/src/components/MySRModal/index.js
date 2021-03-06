import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Logo from "../../assets/800px-Hyundai_Transys_logo.png";
import NoImage from "../../assets/noimage.png";
import axios from "axios";
import cookie from "react-cookies";
// import CloseButton from "./CloseButton";

const ModalWrapper = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
`;

const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;
const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #fff;
  border-radius: 10px;
  width: 700px;
  max-width: 700px;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 20px 20px;
`;
const ContentWrapper = styled.div`
    display: flex,
    text-align: center,
    width: 100%,
    flex-direction: column,
`;
const LogoBox = styled.div`
  margin: 0px 0px 14px;
  display: flex;
  justify-content: center;
`;
const TypeText = styled.div`
  margin: 24px 0px 0px;
  font-size: 17px;
  letter-spacing: -0.5px;
  line-height: 22px;
  font-weight: 700;
`;
const HeadRowContainer = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 15px;
`;

const HeadSpan = styled.span`
  display: flex;
  width: 76%;
`;
const SRInfoBlock = styled.div`
  display: flex;
  width: 100%;
`;
const SRImageBlock = styled.div`
  display: flex;
  width: 100%;
  height: 250px;
`;
const SRImageBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const SRInfoSpan = styled.span`
  display: flex;
  width: 15%;
  color: #0069c0;
  padding-left: 5px;
  padding-bottom: 20px;
  background-color: whitesmoke;
`;
const SRInfoDiv = styled.div`
  padding-left: 10px;
  width: 100%;
`;
const SRConentDiv = styled.div`
  padding-left: 10px;
  width: 100%;
  word-break: break-all;
`;
const SRConentSpan = styled.span`
  display: flex;
  width: 15%;
  color: #0069c0;
  background-color: whitesmoke;
  padding-left: 5px;
  height: 200px;
`;

function MySRModal({
  requestInfos,
  className,
  onClose,
  maskClosable,
  closable,
  visible,
  children,
}) {
  const onMaskClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  const close = (e) => {
    if (onClose) {
      onClose(e);
    }
  };
  //    {closable && <div className="modal-close" onClick={close}></div>}

  //const dispatch = useDispatch();
  //axios.defaults.withCredentials = true;

  const onSubmitHandler = (event) => {
    event.preventDefault(); // ???????????? ??????
  };

  const deleteSRHandler = (reqseq) => {
    //  console.log(reqseq);
    if (window.confirm("?????????????????????????")) {
      axios
        .delete(`${process.env.REACT_APP_API_HOST}/requests/${reqseq}`, {
          headers: {
            Authorization: `Bearer ${cookie.load("token")}`,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.resultCode === 0) {
            alert("????????? ?????????????????????..");
            window.location.reload();
          }
        });
    }
  };

  return (
    <>
      <ModalOverlay visible={visible} />
      <ModalWrapper
        className={className}
        onClick={maskClosable ? onMaskClick : null}
        tabIndex="-1"
        visible={visible}
      >
        <ModalInner>
          <LogoBox>
            <img src={Logo} width="200px" height="50" />
          </LogoBox>
          <ContentWrapper>
            <TypeText>
              <HeadRowContainer>
                <HeadSpan></HeadSpan>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    deleteSRHandler(requestInfos.REQ_SEQ);
                  }}
                  style={{ marginLeft: "80px" }}
                >
                  ????????????
                </Button>
              </HeadRowContainer>
              <HeadRowContainer>
                <HeadSpan>??? ?????? ?????? ????????????</HeadSpan>
                <Link to={`/revise/${requestInfos.REQ_SEQ}`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ marginLeft: "80px" }}
                  >
                    ????????????
                  </Button>
                </Link>
              </HeadRowContainer>

              <SRInfoBlock>
                <SRInfoSpan>??????</SRInfoSpan>
                <SRInfoDiv>
                  {" "}
                  {requestInfos.TITLE}
                  <hr />
                </SRInfoDiv>
              </SRInfoBlock>
              <SRInfoBlock>
                <SRInfoSpan>?????? ??????</SRInfoSpan>
                <SRInfoDiv>
                  {" "}
                  {requestInfos.createdAt.split(" ")[0]}
                  <hr />
                </SRInfoDiv>
              </SRInfoBlock>
              <SRInfoBlock>
                <SRInfoSpan>?????? ??????</SRInfoSpan>
                <SRInfoDiv>
                  {" "}
                  {requestInfos.REG_USER.User_name} <hr />
                </SRInfoDiv>
              </SRInfoBlock>
              <SRInfoBlock>
                <SRInfoSpan>?????? ??????</SRInfoSpan>
                <SRInfoDiv>
                  {" "}
                  {requestInfos.CSR_STATUS} <hr />
                </SRInfoDiv>
              </SRInfoBlock>
              <SRInfoBlock>
                <SRConentSpan>??????</SRConentSpan>
                <SRConentDiv>
                  {" "}
                  {requestInfos.CONTENT} <hr />
                </SRConentDiv>
              </SRInfoBlock>
              <SRImageBlock>
                <SRInfoSpan>?????????</SRInfoSpan>
                <SRImageBox>
                  {requestInfos.REQ_IMG_PATH === null ? (
                    <img src={NoImage} width="200px" height="200px" />
                  ) : (
                    <img
                      src={requestInfos.REQ_IMG_PATH}
                      width="200px"
                      height="200px"
                      onClick={() => {
                        window.open(requestInfos.REQ_IMG_PATH);
                      }}
                    />
                  )}
                </SRImageBox>
              </SRImageBlock>
            </TypeText>

            <form onSubmit={onSubmitHandler}></form>

            {children}
          </ContentWrapper>
        </ModalInner>
      </ModalWrapper>
    </>
  );
}

MySRModal.propTypes = {
  visible: PropTypes.bool,
};

export default MySRModal;
