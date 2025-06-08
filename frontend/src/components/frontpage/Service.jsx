import classes from "./Service.module.css";
import Globe from "../../assets/service/globe.png";
import Lock from "../../assets/service/lock.png";
import Quality from "../../assets/service/quality.png";
import Tag from "../../assets/service/tag.png";
import brandLogo2 from "../../assets/logo/brandLogo2.png";

export default function Service() {
  return (
    <>
      <div className={classes.services}>
        <div className={classes.service1}>
          <img src={Globe} />
          <div>Sell Your Own Products</div>
          <div>
            Reach a global audience by selling your products worldwide. Expand
            your business and showcase your creations to the world.
          </div>
        </div>
        <div className={classes.service2}>
          <img src={Lock} />
          <div>Best Quality</div>
          <div>
            Enjoy the finest quality products, sourced with care to ensure your
            satisfaction. We believe in offering only the best.
          </div>
        </div>
        <div className={classes.service3}>
          <img src={Quality} />
          <div>Best Offers</div>
          <div>
            Get the most competitive prices on the market. Quality products at
            the best prices—that’s our promise to you.
          </div>
        </div>
        <div className={classes.service4}>
          <img src={Tag} />
          <div>Fast Delivery</div>
          <div>
            Experience swift and reliable delivery services. Your orders will
            reach you in no time, no matter where you are.
          </div>
        </div>
      </div>

      <hr />

      <div className={classes.containMore}>
        <div className={classes.more}>
          <div className={classes.promo}>
            <img src={brandLogo2} />
            <h2>The best look anytime, anywhere</h2>
          </div>
          <div className={classes.men}>
            <h3>For Him</h3>
            <p>
              <a href="http://localhost:5173/all-products?category=jeans&page=1&gender=men">
                Men Jeans
              </a>
              <a href="http://localhost:5173/all-products?category=shirt&page=1&gender=men">
                Men Shirts
              </a>
              <a href="http://localhost:5173/all-products?category=tshirt&page=1&gender=men">
                Men T-Shirts
              </a>
              <a href="http://localhost:5173/all-products?category=shoes&page=1&gender=men">
                Men Shoes
              </a>
              <a href="http://localhost:5173/all-products?category=cargo&page=1&gender=men">
                Men Cargo
              </a>
            </p>
          </div>
          <div className={classes.women}>
            <h3>For Her</h3>
            <p>
              <a href="http://localhost:5173/all-products?category=jeans&page=1&gender=women">
                Women Jeans
              </a>
              <a href="http://localhost:5173/all-products?category=cargo&page=1&gender=women">
                Women Cargos
              </a>
              <a href="http://localhost:5173/all-products?category=shirt&page=1&gender=women">
                Women Shirts
              </a>
              <a href="http://localhost:5173/all-products?category=shoes&page=1&gender=women">
                Women Shoes
              </a>
              <a href="http://localhost:5173/all-products?category=tshirt&page=1&gender=women">
                Women T-Shirt
              </a>
            </p>
          </div>
          <div className={classes.subscribe}>
            <h2>Subscribe!</h2>
            <form action="post" className={classes.subscribeForm}>
              <input
                type="email"
                placeholder="Your email address..."
                required
              />
              <button type="submit">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
