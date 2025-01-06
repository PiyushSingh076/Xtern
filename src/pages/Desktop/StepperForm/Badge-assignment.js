import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Box
} from '@mui/material';

export default function BadgeAssignment({ badge, onClose, onEarnBadge }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleSubmit = () => {
    if (selectedAnswer === badge.assignment.correctAnswer) {
      onEarnBadge(badge.id);
    } else {
      alert("Sorry, that's not correct. Try again!");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{badge.name} Assignment</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {badge.assignment.question}
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="badge-assignment"
            name="badge-assignment"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
          >
            {badge.assignment.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={selectedAnswer === null}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
