import React, {useState, useEffect} from 'react';
import "../styles/ForecastCard.css";

function ForecastCard(props) {
  	const [iconSrc, setIconSrc] = useState(null);
  	const [max, setMaxTemp] = useState(null);
  	const [min, setMinTemp] = useState(null);

	function formatDate(daysFromNow = 0) {
		let output = "";
		var date = new Date();
		date.setDate(date.getDate() + daysFromNow);
		output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
		output += " " + date.getDate();
		return output;
	}

	function minTemp(arr, start, end) {
		let min = arr[start].main.temp;

		for (let i = start + 1; i <= end; i++) {
			if (arr[i].main.temp < min) {
				min = arr[i].main.temp;
			}
		}

		return min;
	}

	function maxTemp(arr, start, end) {
		let max = arr[start].main.temp;

		for (let i = start + 1; i <= end; i++) {
			if (arr[i].main.temp > max) {
				max = arr[i].main.temp;
			}
		}
		
		return max;
	}

	const getIcon = async (iconName) => {
		try {
		  const icon = await import(`../icons/${iconName}.svg`);
		  return icon.default;
		} 
		catch (err) {
		  console.error(`Icon not found: ${iconName}`);
		  return null;
		}
	};

	useEffect(() => {
		setMaxTemp(maxTemp(props.forecast.list, (0 + (props.day - 1) * 8), (7 + (props.day - 1) * 8)));
		setMinTemp(minTemp(props.forecast.list, (0 + (props.day - 1) * 8), (7 + (props.day - 1) * 8)));

		const fetchIcon = async () => {
			const icon = await getIcon(props.forecast.list[5 + (props.day - 1) * 8].weather[0].icon);
			setIconSrc(icon);
		};
		fetchIcon();
	}, [props.forecast, props.day])

	return (
		<div class='forecast-card'>
			<h4 class='forecast-date'>{formatDate(props.day)}</h4>
			{iconSrc && <img class="forecast-icon" src={iconSrc} alt="forecast icon"/>}
			<h4 class='forecast-min-max'>{`${Math.round(max)}\u00B0 to ${Math.round(min)}\u00B0`}</h4>
		</div>
	);
}

export default ForecastCard;