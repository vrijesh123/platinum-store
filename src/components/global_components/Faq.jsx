import React, { useState } from "react";
import { motion } from "framer-motion";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';


const FAQ = ({ faq_data }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {faq_data?.map((faq, index) => (
        <motion.div
          key={index}
          className="faq-motion-container"
          initial={{ opacity: 0, y: 20 }} // Start slightly below
          whileInView={{ opacity: 1, y: 0 }} // Animate to original position
          transition={{ duration: 0.4, delay: index * 0.1 }} // Stagger effect
          viewport={{ once: false, amount: 0.9 }} // Trigger once when 10% is visible
        >
          <FAQItem
            faq={faq}
            isOpen={openIndex === index}
            toggle={() => toggleFAQ(index)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FAQ;

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={toggle}>
        <div className="question">{faq.question}</div>
        <span>
          {/* {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} */}
          {isOpen ? <CloseIcon /> : <AddIcon />}

        </span>
      </div>
      <motion.div
        className="faq-answer"
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3 }}
        onClick={toggle}
      >
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        ></div>
      </motion.div>
    </div>
  );
};
