import classes from "./Offers.module.css";
import girl from "../../assets/girl.jpg";
import boy from "../../assets/boy.jpg";
import shoe from "../../assets/shoe.jpg";
import { useNavigate } from "react-router-dom";

export default function Offers() {

  const navigate = useNavigate()

  return (
    <div className={classes.offers}>
      <div className={classes.brands}>
        <div></div>
      </div>
      <div className={classes.offerSection}>
        <div className={classes.firstOffer}>
          <img src={girl} />
          <div className={classes.overlayText}>
            <p>Slay the Street with Every Step</p>
            <p>
              Be bold, be fierce, be unforgettable. Shop the freshest looks in
              women’s fashion today.
            </p>
            <button className={classes.button} onClick={() => navigate("/all-products?gender=women")}>SHOP NOW</button>
          </div>
        </div>
        <div className={classes.secondOffer}>
          <img src={boy} />
          <div className={classes.overlayText}>
            <p>Gear Up, Gentlemen</p>
            <p>
              Fresh fits, bold looks—just for him. Elevate your wardrobe, one
              piece at a time.
            </p>
            <button className={classes.button} onClick={() => navigate("/all-products?gender=men")}>SHOP NOW</button>
          </div>
        </div>
        <div className={classes.thirdOffer}>
          <img src={shoe} />
          <div className={classes.overlayText}>
            <p>Style Has No Gender!</p>
            <p>
              Unisex kicks and clean cuts for every vibe. Walk your way—own your
              look.
            </p>
            <button className={classes.button} onClick={() => navigate("/all-products?gender=unisex")}>SHOP NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
}
