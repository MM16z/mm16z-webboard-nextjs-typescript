import hasJWT from "../jwt_auth/hasJWT";
import getUserauth from "../jwt_auth/getUserAuth";
import { useEffect, useState } from "react";

export default function User() {
  const [username, setUsername] = useState<string | null>(null);

  const routeAuth = () => {
    if (hasJWT()) {
      getUserauth().then((result) => {
        if (result.data.status === "error") {
          localStorage.clear();
          window.location.href = "/";
        } else {
          setUsername(result.data.decoded.username);
        }
      });
    } else {
      setUsername("Anomymous");
    }
  };

  useEffect(() => {
    routeAuth();
  }, []);
  return <div className="userstate">/Home, Howdy! :D @User : {username}</div>;
}
