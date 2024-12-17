
import React from "react";
import Card from "./Card";

import useFetchUsersByType from "../../../hooks/Profile/useFetchUsersByType";

const CardList = ({ profession }) => {


  const {users , loading , error} = useFetchUsersByType(profession)







  return (
    <div className="card-list">
      {users?.length > 0 ? (
        users?.map((data, index) => <Card key={index} data={data} />)
      ) : (
        <p>No professionals match the selected profession.</p>
      )}
    </div>
  );
};

export default CardList;
