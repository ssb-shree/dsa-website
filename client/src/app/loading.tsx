import * as motion from "motion/react-client"
import { CgSpinnerAlt } from "react-icons/cg";

const LoadingPage = () => {
  const message = "Still loading. Still iconic.";

  return (
    <section className="w-screen h-[60vh] flex flex-col justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Spinner */}
        <CgSpinnerAlt size={30} className="animate-spin" />

        {/* Text */}
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.2, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm text-center max-w-xs"
        >
          {message}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default LoadingPage;
