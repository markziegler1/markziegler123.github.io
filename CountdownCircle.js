import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

const CountdownCircle = ({ duration, onComplete }) => {
  const [remainingTime, setRemainingTime] = useState(duration);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((prevTime) => prevTime - 1);
        animatedValue.setValue(remainingTime / duration);
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, duration, onComplete]);

  const strokeDashoffset = Animated.multiply(
    Animated.subtract(1, animatedValue),
    circumference
  );

  return (
    <View>
      <Svg width={2 * radius} height={2 * radius}>
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          fill="transparent"
          stroke="blue"
          strokeWidth="5"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text>{remainingTime}s</Text>
    </View>
  );
};

export default CountdownCircle;
