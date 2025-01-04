import React from "react";
import "./MobHomeScreen.css";
import StudentDiwanLogo from "../../assets/images/xtern-images/StudentDiwanLogo.8fcd85d1ecdb3d8b889a.png";
import EdoboLogo from "../../assets/images/xtern-images/edobo-logo-800x293-2.jpg";
import FundlyLogo from "../../assets/images/xtern-images/fundly.png";
import TransparentLogo from "../../assets/images/xtern-images/65114d62c0c8b53ff6b1b01b_color_transparent-1.png";
import NidoAutomationLogo from "../../assets/images/xtern-images/nido_automation_in_logo.jpeg";
import Images1 from "../../assets/images/xtern-images/images-1.png";
import Images2 from "../../assets/images/xtern-images/images.png";

export default function TrustedComp() {
  return (
    <div className="mob-trusted-comp-container">
      <h2>Trusted by huge organizations</h2>

      <div className="mob-company-slider">
        <div className="mob-slide-row">
          <div className="mob-home-mentor-sec-wrap">
            <div className="home-mentor-sec">
              <div>
                <img src={StudentDiwanLogo} alt="Student Diwan Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={EdoboLogo} alt="Edobo Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={FundlyLogo} alt="Fundly Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={TransparentLogo} alt="Transparent Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={NidoAutomationLogo} alt="Nido Automation Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={Images1} alt="Images 1" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={Images2} alt="Images 2" />
              </div>
            </div>
          </div>
        </div>

        <div className="mob-slide-row">
          {/* Repeat same structure with images */}
          <div className="mob-home-mentor-sec-wrap">
            <div className="home-mentor-sec">
              <div>
                <img src={StudentDiwanLogo} alt="Student Diwan Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={EdoboLogo} alt="Edobo Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={FundlyLogo} alt="Fundly Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={TransparentLogo} alt="Transparent Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={NidoAutomationLogo} alt="Nido Automation Logo" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={Images1} alt="Images 1" />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img src={Images2} alt="Images 2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
