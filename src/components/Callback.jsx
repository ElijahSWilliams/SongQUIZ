import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import quizContext from "../Context/QuizContext";
import { handleRedirect } from "../utils/Auth";
import { getProfileInfo } from "../utils/Api";

function Callback() {
  const { setAccessToken, setCurrentUser, setIsLoggedIn } =
    useContext(quizContext);

  const navigate = useNavigate();

  /*  useEffect(() => {
    const completeAuth = async () => {
      const data = await handleRedirect();
      const token = localStorage.getItem("accessToken");

      if (data && token) {
        setAccessToken(token);
        setIsLoggedIn(true);

        try {
          const user = await getProfileInfo();
          setCurrentUser(user);
          navigate("/");
        } catch (err) {
          console.error("Error fetching user profile:", err);
          navigate("/");
        }
      } else {
        console.error("Auth failed.");
        navigate("/");
      }
    };

    completeAuth();
  }, []);
 */
  return <p>Logging you in...</p>;
}

export default Callback;
