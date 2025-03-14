import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

const AnimatedCard = animated(Card);

const ActionCard = ({ pose }) => {
  const { id, name, image } = pose;

  const [props, set] = useSpring(() => ({
    transform: 'scale(1)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }));

  return (
    <AnimatedCard
      style={props}
      onMouseEnter={() => set({
        transform: 'scale(1.03) translateY(-4px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      })}
      onMouseLeave={() => set({
        transform: 'scale(1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      })}
    >
      <CardActionArea component={Link} to={`/pose/${id}`}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h3" align="center">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </AnimatedCard>
  );
};

export default ActionCard;