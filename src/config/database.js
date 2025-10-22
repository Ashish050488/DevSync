const mongoose =  require('mongoose')
const dotenv= require('dotenv');
dotenv.config();
const ConnectDb = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.NODE_ENV === 'production'
        ? process.env.PROD_DB
        : process.env.LOCAL_DB,
      { autoIndex: true }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports  = ConnectDb;

