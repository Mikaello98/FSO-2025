import { Rating } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

type BarProps = {
  rating: number;
  showText: boolean;
};

const StyledRating = styled(Rating)<{ rating: number }>(({ rating }) => ({
  "& .MuiRating-iconFilled": {
    color:
      rating === 0 ? "green" :        // healthy
      rating === 1 ? "gold" :         // low risk
      rating === 2 ? "orange" :       // high risk
      "red",                          // critical
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  }
}));

const HEALTHBAR_TEXTS = [
  "The patient is in great shape",
  "The patient has a low risk of getting sick",
  "The patient has a high risk of getting sick",
  "The patient has a diagnosed condition",
];

const HealthRatingBar = ({ rating, showText }: BarProps) => {
  return (
    <div className="health-bar">
      <StyledRating
        rating={rating}                // ← REQUIRED
        readOnly
        value={4 - rating}             // invert for hearts
        max={4}
        icon={<Favorite fontSize="inherit" />}
        emptyIcon={<Favorite fontSize="inherit" />}
      />

      {showText && <p>{HEALTHBAR_TEXTS[rating]}</p>}
    </div>
  );
};

export default HealthRatingBar;
