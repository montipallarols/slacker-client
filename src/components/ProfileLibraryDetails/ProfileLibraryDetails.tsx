import React from "react";
import "./ProfileLibraryDetails.css";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card } from "react-bootstrap";

import { selectAllProfiles } from "../../store/profiles/selectors";
import { selectAllListItems } from "../../store/listItems/selectors";

export default function ProfileLibraryDetails() {
  const allProfiles = useSelector(selectAllProfiles);
  const allListItems = useSelector(selectAllListItems);

  interface ParamTypes {
    categoryName: string;
  }
  const { categoryName } = useParams<ParamTypes>();
  console.log(categoryName);

  interface ParamTypes {
    userId: any;
  }
  const { userId } = useParams<ParamTypes>();
  const userIdNum = parseInt(userId);
  const userProfile: any = allProfiles?.find((p: any) => {
    return p.userId === userIdNum;
  });

  const itemType = categoryName === "Films" ? "movie" : "series";

  const listItemsInLibrary = allListItems?.filter((i: any) => {
    return (
      i.list.type === "Library" &&
      i.list.profileId === userProfile.id &&
      i.item.type === itemType
    );
  });
  console.log("List Items in library", listItemsInLibrary);

  return (
    <div>
      <h2>
        {userProfile?.user?.firstName}'s {categoryName} Library
      </h2>
      <div className="library-list">
        {listItemsInLibrary?.map((i: any) => {
          return (
            <Card style={{ width: "12rem", margin: "20px" }} key={i.item.apiId}>
              {i.item.poster === "N/A" ? null : (
                <Link
                  to={`/profiles/${userIdNum}/library/${categoryName}/${i.item.apiId}`}
                >
                  <Card.Img variant="top" src={i.item.poster} alt="poster" />
                </Link>
              )}
              <Card.Body>
                <Card.Title>{i.item.name}</Card.Title>
                <Card.Text>({i.item.year})</Card.Text>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
