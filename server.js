const { app } = require('./dist/');

const port = process.env.PORT || 5000;

// Starts the app on the configured port, then calls the callback when
// the app successfully starts.
app.listen(port, () => {
    console.log(`Listening on port ${port}: http://localhost:${port}`);
});
