import React, { useState, useEffect } from "react";
import Card from "./Card";
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

const CardList = ({ profession }) => {
  const { users, loading, error } = useFetchUsersByType(profession);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchSkill, setSearchSkill] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

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
            width: "250px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
        />

        {/* Filter by Experience */}
        <FormControl
          size="small"
          sx={{
            width: "200px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
        >
          <InputLabel>Filter by experience</InputLabel>
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
            width: "200px",
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
              width: "200px",
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredUsers?.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 3,
            }}
          >
            {filteredUsers.map((data, index) => (
              <Card key={index} data={data} />
            ))}
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
