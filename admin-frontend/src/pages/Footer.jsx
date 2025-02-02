import React from 'react';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '10px', background: '#f1f1f1', position: 'fixed', bottom: 0, width: '100%' }}>
      <p>&copy; {new Date().getFullYear()} Admin Panel. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
