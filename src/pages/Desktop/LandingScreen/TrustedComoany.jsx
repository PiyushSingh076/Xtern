import React from "react";
import "./Homescreen.css";
import StudentDiwanLogo from "../../../assets/images/xtern-images/StudentDiwanLogo.8fcd85d1ecdb3d8b889a.png";
import EdoboLogo from "../../../assets/images/xtern-images/edobo-logo-800x293-2.jpg";
import FundlyLogo from "../../../assets/images/xtern-images/fundly.png";
import TransparentLogo from "../../../assets/images/xtern-images/65114d62c0c8b53ff6b1b01b_color_transparent-1.png";
import NidoAutomationLogo from "../../../assets/images/xtern-images/nido_automation_in_logo.jpeg";
import Images1 from "../../../assets/images/xtern-images/images-1.png";
import Images2 from "../../../assets/images/xtern-images/images.png";

export default function TrustedComoany() {
  return (
    <div className="trusted-company-container">
      <h2>Trusted by huge organizations</h2>

      <div className="slide-container">
        <div className="slide-row">
          <div className="home-mentor-sec-wrap">
            <div className="home-mentor-sec">
              <div>
                <img
                  height="80"
                  width="80"
                  src={StudentDiwanLogo}
                  alt="mentor-img"
                />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img height="80" width="80" src={EdoboLogo} alt="mentor-img" />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img height="80" width="80" src={FundlyLogo} alt="mentor-img" />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img
                  height="80"
                  width="80"
                  src={TransparentLogo}
                  alt="mentor-img"
                />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img
                  height="80"
                  width="80"
                  src={NidoAutomationLogo}
                  alt="mentor-img"
                />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img height="80" width="80" src={Images1} alt="mentor-img" />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>

          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img height="80" width="80" src={Images2} alt="mentor-img" />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
        </div>

        <div className="slide-row">
          <div className="home-mentor-sec-wrap">
            <div className="home-mentor-sec">
              <div>
                <img
                  height="80"
                  width="80"
                  src={StudentDiwanLogo}
                  alt="mentor-img"
                />
              </div>
            </div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img height="80" width="80" src={EdoboLogo} alt="mentor-img" />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img height="80" width="80" src={FundlyLogo} alt="mentor-img" />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img
                  height="80"
                  width="80"
                  src={TransparentLogo}
                  alt="mentor-img"
                />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img
                  height="80"
                  width="80"
                  src={NidoAutomationLogo}
                  alt="mentor-img"
                />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img height="80" width="80" src={Images1} alt="mentor-img" />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>

          <div className="home-mentor-sec-wrap redirect-mentor">
            <div className="home-mentor-sec">
              <div>
                <img height="80" width="80" src={Images2} alt="mentor-img" />
              </div>
            </div>
            <div className="home-mentor-name"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
