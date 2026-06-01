import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Kết nối CSDL thành công!");
    } catch (err) {
        console.log("Đã xảy ra lỗi khi kết nối đến CSDL: ", err);
        process.exit(1);
    }
}

export default connectDb;