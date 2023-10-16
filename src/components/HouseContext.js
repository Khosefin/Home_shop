import React, { createContext, useEffect, useState } from "react";
import { houseData, housesData } from "../data";

export const HouseContext = createContext();

const HouseContextProvider = ({ children }) => {
  const [houses, setHouses] = useState(housesData);
  const [country, setCountry] = useState("Location (any)");
  const [countries, setCountries] = useState([]);
  const [property, setProperty] = useState("Property type (any)");
  const [properties, setProperties] = useState([]);
  const [price, setPrice] = useState("Price range (any)");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allCountries = houses.map((house) => {
      return house.country;
    });
    const uniqueCountries = ["Locatin (any)", ...new Set(allCountries)];
    setCountries(uniqueCountries);
  }, []);

  useEffect(() => {
    const allProperties = houses.map((house) => {
      return house.type;
    });
    const uniqueProperties = ["Property type (any)", ...new Set(allProperties)];
    setProperties(uniqueProperties);
  }, []);

  const clickHandler = () => {
    setLoading(true);
    const isDefult = (str) => {
      return str.split(" ").includes("(any)");
    };

    const minPrice = Number(price.split(" ")[0]);
    const maxPrice = Number(price.split(" ")[2]);

    const newHouses = housesData.filter((house) => {
      const housesPrice = Number(house.price);

      if (
        house.country === country &&
        house.type === property &&
        housesPrice >= minPrice &&
        housesPrice <= maxPrice
      ) {
        return house;
      }
      if (isDefult(country) && isDefult(property) && isDefult(price)) {
        return house;
      }
      if (!isDefult(country) && isDefult(property) && isDefult(price)) {
        return house.country === country;
      }
      if (isDefult(country) && !isDefult(property) && isDefult(price)) {
        return house.type === property;
      }
      if (isDefult(country) && isDefult(property) && !isDefult(price)) {
        return housesPrice >= minPrice && housesPrice <= maxPrice;
      }

      if (!isDefult(country) && !isDefult(property) && isDefult(price)) {
        return house.country === country && house.type === property;
      }

      if (!isDefult(country) && isDefult(property) && !isDefult(price)) {
        return (
          housesPrice >= minPrice &&
          housesPrice <= maxPrice &&
          house.country === country
        );
      }

      if (isDefult(country) && !isDefult(property) && !isDefult(price)) {
        return (
          housesPrice >= minPrice &&
          housesPrice <= maxPrice &&
          house.type === property
        );
      }
    });
    setTimeout(async () => {
      await setLoading(false);
    }, 1000);
    newHouses.length < 1 ? setHouses([]) : setHouses(newHouses);
  };
  return (
    <HouseContext.Provider
      value={{
        country,
        setCountry,
        countries,
        property,
        setProperty,
        properties,
        price,
        setPrice,
        houses,
        loading,
        clickHandler,
      }}
    >
      {children}
    </HouseContext.Provider>
  );
};

export default HouseContextProvider;
