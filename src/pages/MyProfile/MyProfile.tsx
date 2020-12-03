import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import Button from "react-bootstrap/Button";
import { Link, useParams, Redirect, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserProfile, selectUser } from "../../store/user/selectors";
import {
  selectAllProfiles,
  selectProfilesLoading,
} from "../../store/profiles/selectors";
import {
  selectAllFavourites,
  selectAllListItems,
  selectAllCategories,
  selectListItemsLoading,
} from "../../store/listItems/selectors";
import {
  removeItemFromFavourites,
  fetchListItems,
  fetchAllFavourites,
  fetchCategories,
} from "../../store/listItems/actions";
import StarRating from "../../components/StarRating/StarRating";
import {
  selectAllReviews,
  selectReviewsLoading,
} from "../../store/reviews/selectors";
import { selectAppLoading } from "../../store/appState/selectors";
import Loading from "../../components/Loading";
import Rating from "@material-ui/lab/Rating";
import { fetchReviews } from "../../store/reviews/actions";
import { fetchProfiles } from "../../store/profiles/actions";

export default function MyProfile() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAppLoading);
  const user = useSelector(selectUser);
  const allProfiles = useSelector(selectAllProfiles);
  const profilesLoading = useSelector(selectProfilesLoading);
  const allFavourites = useSelector(selectAllFavourites);
  const allListItems = useSelector(selectAllListItems);
  const listItemsLoading = useSelector(selectListItemsLoading);
  const allCategories = useSelector(selectAllCategories);
  const reviewsLoading = useSelector(selectReviewsLoading);
  const allReviews = useSelector(selectAllReviews);
  const history = useHistory();

  useEffect(() => {
    if (!user.token) {
      history.push("/");
    }
  }, [user.token, history]);

  useEffect(() => {
    if (
      reviewsLoading ||
      listItemsLoading ||
      profilesLoading ||
      !allCategories
    ) {
      dispatch(fetchReviews);
      dispatch(fetchListItems);
      dispatch(fetchProfiles);
      dispatch(fetchCategories);
    }
  }, [
    dispatch,
    reviewsLoading,
    listItemsLoading,
    profilesLoading,
    allFavourites,
    allCategories,
  ]);

  useEffect(() => {
    dispatch(fetchAllFavourites);
  }, [dispatch, allFavourites]);

  interface ParamTypes {
    userId: string;
  }
  const { userId } = useParams<ParamTypes>();
  const userIdNum = parseInt(userId);

  const userProfile: any = allProfiles?.find((p: any) => {
    return p.userId === user?.id;
  });

  const userFavourites = allFavourites?.filter((f: any) => {
    return f.list.profileId === userProfile?.id;
  });

  const profileReviews = allReviews?.filter((r: any) => {
    return r.profile.userId === userIdNum;
  });

  function handleClickRemove(event: any) {
    event.preventDefault();
    dispatch(removeItemFromFavourites(event.target.value));
  }

  // if (!user.token) {
  //   return <Redirect to="/"></Redirect>;
  // }

  return (
    <div>
      <h1>{`${userProfile?.firstName} ${userProfile?.lastName}`}</h1>
      <img src={userProfile?.imageUrl} className="profile-image" />
      <p></p>

      <div className="list">
        <div className="list-card">
          <h3>Favourites</h3>
          <div className="item-list">
            {userFavourites?.map((f: any) => {
              return (
                <div key={f.itemId}>
                  <StarRating />
                  <Link
                    to={`/my-profile/${user.id}/favourites/${f.item.apiId}`}
                    className="link"
                  >
                    <div key={f.id} className="item-card">
                      <p>{f.item.name}</p>
                      {allCategories?.map((c: any) => {
                        return c.id === f.item.categoryId ? (
                          <em key={c.id}>
                            <p>({c.name})</p>
                          </em>
                        ) : null;
                      })}
                      {f.item.poster === "N/A" ? null : (
                        <img src={f.item.poster} alt="poster" height="150px" />
                      )}
                    </div>
                    <Button
                      onClick={handleClickRemove}
                      value={f.item.apiId}
                      variant="outline-dark"
                    >
                      Remove
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="list">
        <div className="list-card">
          <h3>Library</h3>
          <div className="item-list">
            {allCategories?.map((c: any) => {
              return (
                <div key={c.id} className="item-card">
                  <p>{c.name}</p>
                  <Link to={`/my-profile/${user.id}/library/${c.name}`}>
                    <Button variant="outline-dark">See list</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="list">
        <div className="list-card">
          <h3>Wishlist</h3>
          <div className="item-list">
            {allCategories?.map((c: any) => {
              return (
                <div key={c.id} className="item-card">
                  <p>{c.name}</p>
                  <Link to={`/my-profile/${user.id}/wishlist/${c.name}`}>
                    <Button variant="outline-dark">See list</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <h3>My Reviews</h3>
      {profileReviews?.map((r: any) => {
        return (
          <div key={r.id}>
            <h4>{r.item.name}</h4>
            {r.item.poster === "N/A" ? null : (
              <img src={r.item.poster} alt="poster" height="100px" />
            )}
            <em>
              <h5>{r.name}</h5>
            </em>
            <em>
              <p>{r.content}</p>
            </em>
            <Rating name="read-only" value={r.rating} readOnly />
            <em>
              <p>
                {r.profile.firstName} {r.profile.lastName}
              </p>
            </em>
          </div>
        );
      })}
    </div>
  );
}
