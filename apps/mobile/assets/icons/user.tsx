import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <View>
      <Svg
        width={props.width}
        height={props.height}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        color={props.color}
      >
        <Path
          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
          stroke={props.color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
          stroke={props.color}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    </View>
  );
}
