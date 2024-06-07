import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useNavigate } from "react-router-dom";

import styles from "./Form.module.css";
import Button from "./Button";
import Message from "./Message";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client/";

export default function Form() {
  const { createCity, isLoading } = useCities();
  const [lat, lng] = useUrlPosition();
  const navigate = useNavigate();
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [findCityError, setFindCityError] = useState("");

  useEffect(
    function () {
      if (!lat && !lng) return;
      async function fetchCityPosition() {
        try {
          setIsLoadingCity(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}}`
          );
          const data = await res.json();

          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city or country, click somewhere else 😉"
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
        } catch (err) {
          setFindCityError(err.message);
        } finally {
          setIsLoadingCity(false);
        }
      }
      fetchCityPosition(lat, lng);
    },
    [lat, lng]
  );

  if (isLoadingCity) return <Spinner />;
  if (!lat && !lng) return <Message message="start by clicking on the map" />;
  if (findCityError) return <Message message={findCityError}></Message>;

  function handleAddCity(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      date,
      notes,
      position: { lat, lng },
    };
    createCity(newCity);
    navigate("/app/cities");
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleAddCity}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}
