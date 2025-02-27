import { baseUrl } from "./Constants";

//catch errors or convert to response to json
export default function checkResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Error: ${res.status}`);
  } else {
    return res.json();
  }
}

/* const getProfileInfo = ({ userID }) => {
  return fetch(`${baseUrl}/users/${userID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, //include token for authorization
      "Content-Type": `application/json`,
    },
  }).then((res) => {
    return checkResponse(res);
  });
};

export { getProfileInfo };
 */
