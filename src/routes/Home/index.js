import React from "react";
import { PORTAL_ENDPOINTS } from "../../utils";
import { getActiveTabUrl, sendMessage } from "../../utils";
import LoginAlert from "../../components/LoginAlert";
import ContentSkeleton from "../../components/ContentSkeleton";
import UserDetails from "../../components/UserDetails";
import ActionCards from "./ActionCards";
import Returns from "../Returns";
import Applications from "../Applications";
import LedgerBalance from "./LedgerBalance";

const Home = () => {
  const [hostName, setHostName] = React.useState("");
  const [userDetails, setUserDetails] = React.useState("");
  const [dropDownData, setDropDownData] = React.useState({});
  const [activeTabURL, setActiveTabURL] = React.useState("");

  let isInitialRender = true;

  React.useEffect(() => {
    if (isInitialRender) {
      setTimeout(async () => {
        const tabHostName = await getTabHostName();
        setHostName(tabHostName);
      }, 500);
      const asynFn = async () => {
        switch (hostName) {
          case "services.gst.gov.in": {
            const userStatus1 = await sendMessage(
              PORTAL_ENDPOINTS.userStatus1,
              "user-status-1"
            );
            setUserDetails(userStatus1.data);
            break;
          }
          case "return.gst.gov.in": {
            const userStatus2 = await sendMessage(
              PORTAL_ENDPOINTS.userStatus1,
              "user-status-2"
            );
            console.log(userStatus2);
            const dropDown = await sendMessage(
              PORTAL_ENDPOINTS.dropDown,
              "drop-down"
            );
            console.log(dropDown);
            setUserDetails(userStatus2.data);
            setDropDownData(dropDown.data);
            break;
          }
          default:
        }
      };
      asynFn();
    }
    //isInitialRender = false;
  }, [hostName]);

  const getTabHostName = async () => {
    return new Promise((resolve) => {
      getActiveTabUrl().then((url) => {
        setActiveTabURL(url);
        const hostName = new URL(url).hostname;
        resolve(hostName);
      });
    });
  };

  const content = () => {
    switch (hostName) {
      case "":
        return <ContentSkeleton />;

      case "services.gst.gov.in":
        console.log(activeTabURL);
        if (
          activeTabURL ===
          "https://services.gst.gov.in/litserv/auth/case/search"
        ) {
          return <Applications />;
        } else if (userDetails === "") {
          return <ContentSkeleton />;
        } else if (userDetails.gstin) {
          return (
            <>
              <UserDetails data={userDetails} />
              <LedgerBalance />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <ActionCards />
                <ActionCards />
              </div>
            </>
          );
        } else return <LoginAlert alertType={2} />;

      case "return.gst.gov.in":
        return (
          <>
            <div style={{ marginTop: "8px" }}>
              <UserDetails data={userDetails} />
              <div style={{ marginTop: "8px" }}>
                <Returns data={dropDownData} />
              </div>
            </div>
          </>
        );

      default:
        return <LoginAlert alertType={1} />;
    }
  };

  return content();
};

export default Home;
