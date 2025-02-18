const express = require('express');
require('./config/database');
const userRouter =  require('./routes/userRouter');
const postRouter =  require('./routes/postRouter')

const PORT  =process.env.PORT || 2006;

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(postRouter);

app.listen(PORT, () => {
      console.log(`server is listening to PORT: ${PORT}`)
      
})