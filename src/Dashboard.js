import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [house, setHouse] = useState("dummy");
  const [fetchHouse, setFetchHouse] = useState("");
  const [houseArr, setHouseArr] = useState([]);
  const [room, setRoom] = useState("");
  const [fetchRoom, setFetchRoom] = useState([]);
  const [roomArr, setRoomArr] = useState([]);

  //handle input search
  const handleChange = (e) => {
    if (e.target.name === "house") {
      setHouse(e.target.value);
      getHouses(house);
    } else if (e.target.name === "room-select") {
      setRoom(e.target.value);
      setFetchRoom(roomArr.filter((iroom) => iroom._id === room));
      console.log(fetchRoom);
    }
  };

  //get house suggestions on each type
  const getHouses = async (house) => {
    const accesstoken = localStorage.getItem("accesstoken");
    const response = await axios.get(
      `https://web.alistetechnologies.com/v2/admin/search/house/${house}`,
      {
        headers: {
          accesstoken: accesstoken,
        },
      }
    );
    setHouseArr(response.data.data.houses);
  };

  //get Room details on selecting house
  const getRoom = async (e) => {
    // setHouseArr([]);
    setRoomArr([]);
    setFetchHouse(e.target.id);
    const response = await axios.get(
      `https://web.alistetechnologies.com/v2/admin/house_details/${fetchHouse}`
    );
    const data = await response.data.data.rooms;
    setRoomArr(data);
    if (response.status === 200) setHouseArr([]);
  };

  //get Devices on selecting room
  //   const getDevices = async (room) => {
  //     const response = await axios.get()
  //   };

  return (
    <div className="dashboard">
      <h1>Hi, there!</h1>
      <nav className="nav">
        <p>Device Analysis</p>
        <p>Device Details</p>
      </nav>
      <DeviceAnalysis
        house={house}
        handleChange={handleChange}
        getRoom={getRoom}
        houseArr={houseArr}
        roomArr={roomArr}
        fetchRoom={fetchRoom}
      />
    </div>
  );
}

function DeviceAnalysis(props) {
  const { house, handleChange, getRoom, houseArr, roomArr, fetchRoom } = props;
  return (
    <div className="search">
      <label>
        Search house
        <input
          type="text"
          value={house}
          onChange={handleChange}
          name="house"
        ></input>
        {houseArr.length > 0 && (
          <div className="house-suggestions-container">
            {houseArr.map((house, index) => {
              if (index < 6) {
                return (
                  <p
                    onClick={getRoom}
                    id={house._id}
                    className="house-suggestions"
                  >
                    {house.houseName}
                  </p>
                );
              }
            })}
          </div>
        )}
      </label>
      <br />
      {roomArr.length > 0 && (
        <label>
          Select Room
          <select onChange={handleChange} value="select" name="room-select">
            <option value="select">Select Room</option>
            {roomArr.map((room) => {
              return (
                <option onChange={handleChange} value={room._id}>
                  {room.roomName === ""
                    ? "No Room name provided"
                    : room.roomName}
                </option>
              );
            })}
          </select>
        </label>
      )}
      <br />
      {fetchRoom.length > 0 && fetchRoom.map((room) => <p>{room.devices}</p>)}
    </div>
  );
}
