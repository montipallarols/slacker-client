import React, { useEffect, useState } from "react";
import "./HomePage.css";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../store/profiles/actions";
import {
  fetchListItems,
  fetchCategories,
  fetchFavouritesByCategory,
  fetchAllFavourites,
} from "../../store/listItems/actions";
import {
  selectProfilesLoading,
  // selectAllProfiles,
} from "../../store/profiles/selectors";
import {
  selectListItemsLoading,
  selectAllCategories,
  selectAllFavourites,
} from "../../store/listItems/selectors";
// import { selectFavouriteItemsByCategory } from "../../store/listItems/selectors";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import FavouriteCard from "../../components/FavouriteCard/FavouriteCard";
import { selectToken } from "../../store/user/selectors";
import {
  selectAllReviews,
  selectReviewsLoading,
} from "../../store/reviews/selectors";
import { fetchReviews } from "../../store/reviews/actions";

export default function HomePage() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const profilesLoading = useSelector(selectProfilesLoading);
  const listItemsLoading = useSelector(selectListItemsLoading);
  const reviewsLoading = useSelector(selectReviewsLoading);
  const allCategories = useSelector(selectAllCategories);
  const allFavourites = useSelector(selectAllFavourites);
  const allReviews = useSelector(selectAllReviews);
  // const allProfiles = useSelector(selectAllProfiles);
  // const favouriteItemsByCategory = useSelector(selectFavouriteItemsByCategory);

  const [filterList, setFilterList] = useState("Profiles");
  const [categoryFilterId, setCategoryFilterId] = useState("");

  useEffect(() => {
    if (
      listItemsLoading ||
      profilesLoading ||
      reviewsLoading ||
      !allFavourites ||
      !allCategories
    ) {
      dispatch(fetchListItems);
      dispatch(fetchProfiles);
      dispatch(fetchReviews);
      dispatch(fetchAllFavourites);
      dispatch(fetchCategories);
    }
  }, [
    dispatch,
    listItemsLoading,
    profilesLoading,
    allFavourites,
    allCategories,
  ]);

  function onSearchProfiles() {
    setFilterList("Profiles");
  }

  useEffect(() => {
    dispatch(fetchFavouritesByCategory(categoryFilterId));
  }, [dispatch, categoryFilterId]);

  if (profilesLoading || listItemsLoading) {
    return <p>"Loading..."</p>;
  } else {
    return (
      <div className="welcome-text">
        <h1 className="title">Welcome to Slacker!</h1>
        <img
          src="https://storage.googleapis.com/ff-storage-p01/festivals/logos/000/039/385/large/logo.jpg?1498668430"
          alt="logo"
          height="170px"
        />
        <em>
          <h4 className="app-intro">
            Keeping lists in a notes app can become an incoherent mess.{" "}
          </h4>
        </em>
        <div className="app-description">
          <p>
            Whether you want to curate nostalgic glimpses of a gone generation
            or check a film you’ve just heard about, Slacker is the space for
            you.
          </p>
          <p>
            Here you can curate, review and share your favourite films and
            series or add them to your wishlist so you can enjoy them later.
          </p>
        </div>
        {token ? null : (
          <div>
            <p>Sign up to create your profile!</p>
            <br></br>
            <Link to="/signup">
              <Button variant="dark">Sign up</Button>
            </Link>
            <br></br>
            <p>
              Already have an account? Log in <Link to="/login">here</Link>
            </p>
          </div>
        )}

        <div>
          <Button onClick={onSearchProfiles} variant="outline-dark">
            All profiles
          </Button>{" "}
          {allCategories?.map((category: any) => (
            <Button
              key={category.id}
              variant="outline-dark"
              onClick={() => {
                setCategoryFilterId(category.id);
                setFilterList(`${category.name}`);
              }}
            >
              All Favourite {category.name}
            </Button>
          ))}
        </div>
        <br></br>

        {filterList === "Profiles" ? <ProfileCard /> : <FavouriteCard />}
      </div>
    );
  }
}
