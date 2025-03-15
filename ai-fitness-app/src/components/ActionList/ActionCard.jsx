import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { useSpring, animated } from "@react-spring/web";

const AnimatedCard = animated(Card);

const ActionCard = ({ pose }) => {
  const { id, name, image } = pose;

  const [props, set] = useSpring(() => ({
    transform: "scale(1)",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  }));

  return (
    <AnimatedCard
      style={props}
      sx={{ height: "320px", width: "100%" }}
      onMouseEnter={() =>
        set({
          transform: "scale(1.03) translateY(-4px)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        })
      }
      onMouseLeave={() =>
        set({
          transform: "scale(1)",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        })
      }
    >
      <CardActionArea
        component={Link}
        to={`/pose/${id}`}
        sx={{ height: "100%" }}
      >
        <CardMedia
          component="img"
          sx={{
            padding: "10px",
            height: "75%",
            width: "100%",
            objectFit: "cover",
          }} // 图片占据75%高度
          image={image}
          alt={name}
        />
        <CardContent
          sx={{
            height: "25%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            align="center"
            sx={{ width: "100%" }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </AnimatedCard>
  );
};

export default ActionCard;
