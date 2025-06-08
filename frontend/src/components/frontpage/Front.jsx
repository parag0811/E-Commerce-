import { useState } from "react";
import classes from "./Front.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Front() {
  const [x, setX] = useState(0);

  const navigate = useNavigate();

  return (
    <>
      <main className={classes.main}>
        <div>
          <div>
            <motion.p
              className={classes.tagHeader}
              variants={{
                init: { x: -100, filter: "blur(2px)", opacity: 0 },
                onAnimate: { x: x, filter: "blur(0px)", opacity: 1 },
              }}
              initial="init"
              animate="onAnimate"
              transition={{ duration: 2, type: "tween" }}
            >
              Raining Offers For <span>Hot Summer!</span>
            </motion.p>
            <motion.p
              className={classes.secondHeader}
              variants={{
                init: { x: -100, filter: "blur(2px)", opacity: 0 },
                onAnimate: { x: x, filter: "blur(0px)", opacity: 1 },
              }}
              initial="init"
              animate="onAnimate"
              transition={{ duration: 2, type: "tween" }}
            >
              25% Off On All Products
            </motion.p>
            <div className={classes.twoButton}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" }}
                onClick={() => navigate("/all-products")}
              >
                SHOP NOW
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" }}
                onClick={() => navigate("/cart")}
              >
                ORDER NOW
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
