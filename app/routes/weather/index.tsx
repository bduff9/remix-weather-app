import axios from "axios";
import { redirect, useLoaderData } from "remix";
import type { LoaderFunction } from 'remix';

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const search = new URLSearchParams(url.search);

    if (!search.get("city")) return redirect("/");

    const city = search.get("city");
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    console.log(res.data);

    return { city, type: res.data.weather[0].main, temp: res.data.main.temp };
  } catch (err) {
    console.error(err);
    redirect("/");

    return {};
  }
}

type WeatherResult = {
  city: string;
  type: string;
  temp: number;
};

export default function Index() {
  const data = useLoaderData<WeatherResult>();

  return (
    <div>
      <h1>{data.city}</h1>
      <h2>{data.type}</h2>
      <h3>Temperature: {data.temp} °C</h3>
    </div>
  );
}

