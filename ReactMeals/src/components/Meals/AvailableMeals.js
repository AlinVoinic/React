import { useEffect, useState } from "react";
import Meal from "./MealItem/Meal";
import styles from "./AvailableMeals.module.css";
import Card from "../UI/Card";

// const DUMMY_MEALS = [{...}] le-am mutat in BD din Firebase!
// The function passed to useEffect should NOT return a Promise!
// THROWING ERRORS INSIDE ASYNC FUNCTIONS WILL CAUSE THE PROMISE TO REJECT!

function AvailableMeals() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  useEffect(() => {
    const fetchMeals = async () => {
      const response = await fetch(
        "https://react-http-ae5cd-default-rtdb.europe-west1.firebasedatabase.app/meals.json" // sending a request to the REST API endpoint
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const responseData = await response.json();

      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          // key: key,
          // access v nested object v
          name: responseData[key].name,
          price: responseData[key].price,
          description: responseData[key].description,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
    };

    // try { fetchMeals();
    // } catch (error) {
    //   setIsLoading(false);
    //   setHttpError(error.message);
    // }

    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return <section className={styles.spinner}></section>;
  }

  if (httpError) {
    return (
      <section className={styles.mealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  const mealsList = meals.map((item) => (
    <Meal
      id={item.id}
      key={item.id}
      name={item.name}
      price={item.price}
      description={item.description}
    />
  ));

  return (
    <section className={styles.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
}

export default AvailableMeals;
