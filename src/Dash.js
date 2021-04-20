import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useHistory } from "react-router-dom";

export default function Dashboard() {
  const history = useHistory();
  const details = useRef(null);
  const analysis = useRef(null);
  const roomSel = useRef(null);
  const suggestionsDiv = useRef(null);
  const [house, setHouse] = useState("");
  const [houseId, setHouseId] = useState("");
  const [houseArr, setHouseArr] = useState([]);

  const [roomArr, setRoomArr] = useState([]);
  const [room, setRoom] = useState("select");
  const [filteredRoom, setFilteredRoom] = useState([]);

  const [device, setDevice] = useState("");
  const [deviceDetails, setDeviceDetails] = useState({
    deviceId: "",
    user: {
      name: " ",
      email: "",
    },
    house_history: [
      {
        house: "",
        time: "",
      },
    ],
    dispatch_history: [],
    return_history: [],
    credential_history: [
      {
        house: "",
        ws: "",
        wp: "",
        time: "",
      },
    ],
    warranty_start: "",
    connectivity_request: "",
    connectivity_response: "",
    _id: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  });

  const [deviceAnalysis, setDeviceAnalysis] = useState([]);
  const [deviceAnalysisRow, setDeviceAnalysisRow] = useState([]);
  const [view, setView] = useState(false);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  useEffect(() => {
    getDeviceDetails(device);
  }, [view, deviceAnalysis, deviceDetails]);

  //handles logout
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    history.push("/");
  };

  const handleChange = (e) => {
    //change of input field of house search
    if (e.target.name === "house") {
      setHouse(e.target.value);
      getHouseSuggestions(house);
      setRoom("select");
      setDevice("select");
    }
    //change of select input for room
    else if (e.target.className === "room-select dashboard-input") {
      setRoom(e.target.value);
      localStorage.setItem(
        "roomName",
        roomSel.current.options[roomSel.current.selectedIndex].text
      );
      setIsDataAvailable(false);
      setDevice("select");
    }
    //change of select input for device
    else if (e.target.className === "device-select dashboard-input") {
      setDevice(e.target.value);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    //click on suggestions
    if (e.target.className === "house-suggestions") {
      setHouse(e.target.innerText);
      setHouseId(e.target.id);
    }
    //click on search button of house
    else if (e.target.name === "house") {
      getRoomsFromHouse(houseId);
      setHouseArr([]);
      suggestionsDiv.current.style.background = "none";
    }
    //click on search button of room
    else if (e.target.name === "room") {
      setFilteredRoom(roomArr.filter((iroom) => iroom._id === room));
    }
    //click on the device
    else if (e.target.name === "device") {
      getDeviceDetails(device);
    }
  };

  //get house suggestions based on input text
  const getHouseSuggestions = async (houseQuery) => {
    const accesstoken = localStorage.getItem("accesstoken");
    const response = await axios.get(
      `https://web.alistetechnologies.com/v2/admin/search/house/${houseQuery}`,
      {
        headers: {
          accesstoken: accesstoken,
        },
      }
    );
    setHouseArr(response.data.data.houses);
    suggestionsDiv.current.style.background = "white";
  };

  //get rooms based on house selected
  const getRoomsFromHouse = async (houseId) => {
    const accesstoken = localStorage.getItem("accesstoken");
    const response = await axios.get(
      `https://web.alistetechnologies.com/v2/admin/house_details/${houseId}`,
      {
        headers: {
          accesstoken: accesstoken,
        },
      }
    );
    setRoomArr(response.data.data.rooms);
  };

  //get device speific detauils
  const getDeviceDetails = async (device) => {
    if (view === true) {
      const response = await axios.get(
        `https://admin.alistetechnologies.com/devices/details/${device}`
      );
      setDeviceDetails(response.data.data.device);
    } else if (view === false) {
      const response = await axios.get(
        `https://analysis.alistetechnologies.com:443/analysis/?date=03_02_2021&deviceId=${device}`
      );
      createArrOfObj(response.data.split(","));
    }
    setIsDataAvailable(true);
  };

  //create array of objects for device analysis from the string
  //from the API
  const createArrOfObj = (string) => {
    let obj = new Object();
    let arr = [];
    let arr2 = [];
    for (let i = 4; i < string.length - 1; i++) {
      if ((i + 1) % 4 === 1) {
        let val = string[i].indexOf('"', 1);
        let replace1 = string[i].slice(val + 3, string[i].length - 2);
        let replace2 = string[0].slice(1, string[0].length - 1);
        obj[replace2] = replace1;
        arr2[0] = replace2;
      } else if ((i + 1) % 4 === 2) {
        let replace1 = string[1].slice(1, string[1].length - 1);
        obj[replace1] = string[i].slice(1, string[i].length - 1);
        arr2[1] = replace1;
      } else if ((i + 1) % 4 === 3) {
        let replace1 = string[2].slice(1, string[2].length - 1);
        obj[replace1] = string[i].slice(1, string[i].length - 1);
        arr2[2] = replace1;
      } else if ((i + 1) % 4 === 0) {
        let replace1 = string[3].slice(1, string[3].length - 1);
        obj[replace1] = string[i].slice(1, string[i].length - 1);
        arr2[3] = replace1;
        arr.push(obj);
        obj = {};
      }
    }
    localStorage.setItem("totalTimeOnline", string[string.length - 1]);
    setDeviceAnalysis(arr);
    setDeviceAnalysisRow(arr2);
  };
  //to switch between device details and device analysis
  const switchView = (e) => {
    e.preventDefault();
    //true is for Device Details view
    if (e.target.id === "details") {
      details.current.classList.add("selected");
      analysis.current.classList.remove("selected");
      setView(true);
    }
    //false is for Device Analysis view
    else {
      details.current.classList.remove("selected");
      analysis.current.classList.add("selected");
      setView(false);
    }
    getDeviceDetails(device);
  };
  return (
    <>
      <button id="logout" onClick={handleLogout}>
        Logout
      </button>
      <div className="dashboard-container">
        <div className="left">
          <h2 className="welcome-heading">
            Hi, {localStorage.getItem("user_name")}
          </h2>
          <nav className="nav">
            <h3
              ref={details}
              id="details"
              className="selected"
              onClick={switchView}
            >
              Device Detail
            </h3>
            <h3 ref={analysis} id="analysis" onClick={switchView}>
              Device Analysis
            </h3>
          </nav>
          <DeviceDetailsForm
            handleChange={handleChange}
            house={house}
            handleClick={handleClick}
            houseArr={houseArr}
            roomArr={roomArr}
            room={room}
            filteredRoom={filteredRoom}
            device={device}
            suggestionsDiv={suggestionsDiv}
            roomSel={roomSel}
          />
        </div>
        <div className="right">
          {isDataAvailable ? (
            view ? (
              <DeviceDetails
                deviceDetails={deviceDetails}
                houseId={houseId}
                house={house}
              />
            ) : (
              <DeviceAnalysis
                deviceDetails={deviceDetails}
                houseId={houseId}
                house={house}
                deviceAnalysisRow={deviceAnalysisRow}
                deviceAnalysis={deviceAnalysis}
              />
            )
          ) : (
            <NothingSelected />
          )}
        </div>
      </div>
    </>
  );
}
//this component is for form on left side of dashboard
function DeviceDetailsForm(props) {
  const {
    handleChange,
    house,
    handleClick,
    houseArr,
    roomArr,
    room,
    filteredRoom,
    device,
    suggestionsDiv,
    roomSel,
  } = props;
  return (
    <form>
      <label>
        <br />
        <input
          className="dashboard-input"
          type="text"
          name="house"
          placeholder="Search your house"
          onChange={handleChange}
          value={house}
          autoComplete="off"
        />
        <button className="search-btn" name="house" onClick={handleClick}>
          🔍
        </button>
        <div ref={suggestionsDiv} className="house-suggestions-container">
          {houseArr.length > 0 &&
            houseArr.map((house, index) => {
              if (index < 7) {
                return (
                  <p
                    onClick={handleClick}
                    id={house._id}
                    className="house-suggestions"
                  >
                    {house.houseName}
                  </p>
                );
              }
            })}
        </div>
      </label>
      <br />
      {roomArr.length > 0 && (
        <label>
          <select
            ref={roomSel}
            value={room}
            className="room-select dashboard-input"
            onChange={handleChange}
          >
            <option value="select">Select Room</option>
            {roomArr.map((room) => {
              return (
                <option value={room._id}>
                  {room.roomName === "" ? "Unnamed room" : room.roomName}
                </option>
              );
            })}
          </select>
          <button className="search-btn" name="room" onClick={handleClick}>
            🔍
          </button>
        </label>
      )}
      <br />
      {filteredRoom.length > 0 && (
        <label>
          {filteredRoom.map((room) => {
            if (room.devices.length === 0)
              return (
                <p
                  style={{
                    color: "red",
                    textAlign: "right",
                    marginTop: "20px",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  Oops! No devices in the room
                </p>
              );
            else {
              return (
                <>
                  <select
                    style={{ marginTop: "40px" }}
                    value={device}
                    className="device-select dashboard-input"
                    onChange={handleChange}
                  >
                    <option value="select">Select Device</option>
                    {room.devices.map((device) => (
                      <option value={device}>{device}</option>
                    ))}
                  </select>
                  <button
                    className="search-btn"
                    name="device"
                    onClick={handleClick}
                  >
                    🔍
                  </button>
                </>
              );
            }
          })}
        </label>
      )}
    </form>
  );
}

//this component is to show Device Details
function DeviceDetails(props) {
  const { deviceDetails, house, houseId } = props;
  return (
    <div className="device-detials-container">
      <BasicDetials deviceDetails={deviceDetails} house={house} />
      <div className="device-details">
        <div>
          <div>
            <h3>CONNECTIVITY REQUEST:</h3>
            <h5>
              {moment(
                deviceDetails.connectivity_request.split("T")[0],
                "YYYY-MM-DD"
              ).format("MMM Do YYYY")}
            </h5>
          </div>
          <div>
            <h3>CONNECTIVITY RESPONSE:</h3>
            <h5>
              {moment(
                deviceDetails.connectivity_response.split("T")[0],
                "YYYY-MM-DD"
              ).format("MMM Do YYYY")}
            </h5>
          </div>
        </div>
        <div>
          <div>
            <h3>CREATED AT:</h3>
            <h5>
              {moment(
                deviceDetails.createdAt.split("T")[0],
                "YYYY-MM-DD"
              ).format("MMM Do YYYY")}
            </h5>
          </div>
          <div>
            <h3>UPDATED AT:</h3>
            <h5>
              {moment(
                deviceDetails.updatedAt.split("T")[0],
                "YYYY-MM-DD"
              ).format("MMM Do YYYY")}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

//This component is to show device Analysis
function DeviceAnalysis(props) {
  const { deviceAnalysis, deviceAnalysisRow, deviceDetails, house } = props;
  return (
    <div className="device-detials-container">
      <BasicDetials deviceDetails={deviceDetails} house={house} />
      <div className="device-analysis-container">
        <div className="column-container">
          {deviceAnalysisRow.map((column) => (
            <p className="column">{column}</p>
          ))}
        </div>
        <div className="row-container">
          {deviceAnalysis.map((column, index) => {
            if (index < 11) {
              return (
                <div className="rows">
                  <p className="column" style={{ width: "25%" }}>
                    {column["Socket ID"]}
                  </p>
                  <p className="column" style={{ width: "20%" }}>
                    {moment(
                      column["Ontime"].split("T")[0],
                      "YYYY-MM-DD"
                    ).format("MMM Do YYYY")}
                  </p>
                  <p className="column" style={{ width: "20%" }}>
                    {moment(
                      column["Ontime"].split("T")[0],
                      "YYYY-MM-DD"
                    ).format("MMM Do YYYY")}
                  </p>
                  <p className="column" style={{ width: "20%" }}>
                    {column["Time online"]}
                  </p>
                </div>
              );
            }
          })}
        </div>
      </div>
      <h4 id="total">
        Total Time Online:{" "}
        <span>{localStorage.getItem("totalTimeOnline")}</span>
      </h4>
    </div>
  );
}

//Basic details component that is common in Device details
// and device analysis
function BasicDetials(props) {
  const { deviceDetails, house } = props;
  return (
    <>
      <h2>
        <span>Device Id: </span>
        {deviceDetails.deviceId}
      </h2>
      <div className="house-room-details">
        <div>
          <div className="device-owner">
            <img src="/images/house.svg" />
            <h3>{house}</h3>
          </div>
          <div className="device-owner">
            <img src="/images/room.svg" />
            <h3>{localStorage.getItem("roomName")}</h3>
          </div>
        </div>
        <div className="device-owner move-left">
          <img src="/images/user2.svg" />
          <h3>{deviceDetails.user.name}</h3>
        </div>
      </div>
    </>
  );
}

// to show that nothing selected yet
function NothingSelected() {
  return (
    <div className="nothing-selected">
      <img src="/images/computer.svg"></img>
      <h2>Nothing Selected!</h2>
    </div>
  );
}
