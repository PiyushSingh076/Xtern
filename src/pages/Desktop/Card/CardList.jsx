import React, { useState, useEffect } from "react";
import Card from "./Card";
import CreateJobCard from "./CreateJobCard";
import { ShimmerCard } from "./Card"; // Import ShimmerCard
import useFetchUsersByType from "../../../hooks/Profile/useFetchUsersByType";
import { State, City } from "country-state-city";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PopupDetails from "./PopupDetails";
import { ENTREPRENEUR_ROLE } from "../../../constants/Roles/professionals";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

const CardList = ({ profession }) => {
  const { users, loading, error } = useFetchUsersByType(profession);
  const { userData } = useFetchUserData();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchSkill, setSearchSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [hoveredCardId, setHoveredCardId] = useState(null); // New state to track hovered card ID

  useEffect(() => {
    const filtered = users?.filter((user) => {
      const matchesSkill =
        !searchSkill ||
        user.skillSet?.some((skill) =>
          skill.skill.toLowerCase().includes(searchSkill.toLowerCase())
        );

      const matchesExperience =
        !experience || user.experience >= parseInt(experience, 10);

      const matchesCity =
        !selectedCity || user.city.toLowerCase() === selectedCity.toLowerCase();

      const matchesState =
        !selectedState ||
        user.state.toLowerCase() === selectedState.toLowerCase();

      return matchesSkill && matchesExperience && matchesCity && matchesState;
    });

    setFilteredUsers(filtered);
  }, [users, searchSkill, experience, selectedCity, selectedState]);

  const handleStateChange = (stateCode) => {
    setSelectedState(stateCode);
    setSelectedCity("");
  };

  const resetFilters = () => {
    setSearchSkill("");
    setExperience("");
    setSelectedState("");
    setSelectedCity("");
  };

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Filter Header */}
      <Paper
        elevation={3}
        sx={{
          padding: "15px",
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          marginBottom: "40px",
          borderRadius: "15px",
        }}
      >
        {/* Search by Skill */}
        <TextField
          label="Search by skill"
          variant="outlined"
          size="small"
          value={searchSkill}
          onChange={(e) => setSearchSkill(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "#1976d2", marginRight: "8px" }} />
            ),
          }}
          sx={{
            width: { xs: "140px", sm: "250px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
        />

        {/* Filter by Experience */}
        <FormControl
          size="small"
          sx={{
            width: { xs: "150px", sm: "200px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
        >
          <InputLabel>Experience</InputLabel>
          <Select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            label="Filter by experience"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">1+ years</MenuItem>
            <MenuItem value="3">3+ years</MenuItem>
            <MenuItem value="5">5+ years</MenuItem>
          </Select>
        </FormControl>

        {/* Select State */}
        <FormControl
          size="small"
          sx={{
            width: { xs: "150px", sm: "200px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
        >
          <InputLabel>Select State</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            label="Select State"
          >
            <MenuItem value="">All</MenuItem>
            {State.getStatesOfCountry("IN").map((state) => (
              <MenuItem key={state.isoCode} value={state.isoCode}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedState && (
          <FormControl
            size="small"
            sx={{
              width: { xs: "150px", sm: "200px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "15px",
              },
            }}
          >
            <InputLabel>Select City</InputLabel>
            <Select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              label="Select City"
            >
              <MenuItem value="">All</MenuItem>
              {City.getCitiesOfState("IN", selectedState).map((city) => (
                <MenuItem key={city.name} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Reset Filters Button */}
        <Tooltip title="Reset Filters">
          <IconButton
            onClick={resetFilters}
            sx={{
              backgroundColor: "#f5f5f5",
              color: "#1976d2",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Card List */}
      <Box>
        {loading ? (
          <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(auto-fill, minmax(150px, 1fr))",
              sm: "repeat(auto-fill, minmax(300px, 1fr))",
            },
            gap: 3,
          }}
        >
          {/* Show 6 shimmer cards while loading */}
          {[...Array(6)].map((_, index) => (
            <ShimmerCard key={`shimmer-${index}`} />
          ))}
        </Box>
        ) : filteredUsers?.length > 0 ? (
          <Box
          classNam="card-list"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(auto-fill, minmax(150px, 1fr))", // Smaller cards for mobile
                sm: "repeat(auto-fill, minmax(300px, 1fr))",
              },
              gap: 3,
               position: "relative",
        padding: 4,
            }}
          >
            {/* this card is displayed only for users whose role is entrepreneur */}
            {(userData?.type ?? "") === ENTREPRENEUR_ROLE && <CreateJobCard />}

            {/* <div className="card-list"> */}
      {users?.map((data, index) => (
        <div className="card-wrapper" key={index}>
          <Card data={data} />
        </div>
      ))}
    {/* </div> */}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "200px",
            }}
          >
            <LocationOnIcon sx={{ fontSize: "48px", color: "gray" }} />
            <Typography variant="h6" color="textSecondary">
              No professionals found matching the selected criteria.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CardList;
