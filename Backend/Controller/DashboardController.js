const Dashboard = require('../models/Dashboard');

// Create or update a dashboard entry
exports.createOrUpdateDashboard = async (req, res) => {
  const { email, games, TotalQuestions, TotalCorrect, TotalWrong, TotalUnanswered, TotalTimeAverage } = req.body;

  try {
    let dashboard = await Dashboard.findOne({ email });

    if (!dashboard) {
      // If the email does not exist, create a new dashboard entry
      dashboard = new Dashboard({
        email,
        TotalQuestions,
        TotalCorrect,
        TotalWrong,
        TotalUnanswered,
        TotalTimeAverage,
        games
      });
      await dashboard.save();
      return res.status(201).send({ message: 'Dashboard created successfully', dashboard });
    } else {
      // If the email exists, update the totals and add the new Games data to the existing Games array
      dashboard.TotalQuestions += TotalQuestions;
      dashboard.TotalCorrect += TotalCorrect;
      dashboard.TotalWrong += TotalWrong;
      dashboard.TotalUnanswered += TotalUnanswered;

      // Update TotalTimeAverage
      const totalEntries = dashboard.games.length + games.length;
      dashboard.TotalTimeAverage = Math.ceil(
        ((dashboard.TotalTimeAverage * dashboard.games.length) + (TotalTimeAverage * games.length)) / totalEntries
      );


      games.forEach((newGame) => {
        const existingGame = dashboard.games.find(game => game.gameId === newGame.gameId);
        if (existingGame) {
          existingGame.Correct += newGame.Correct;
        } else {
          dashboard.games.push(newGame);
        }
      });

      await dashboard.save();
      return res.status(200).send({ message: 'Dashboard updated successfully', dashboard });
    }
  } catch (err) {
    console.error('Error creating or updating dashboard:', err);
    res.status(500).send({ message: 'Error creating or updating dashboard' });
  }
};

// Get all dashboard entries
exports.getDashboards = async (req, res) => {
  try {
    const dashboards = await Dashboard.find();
    res.status(200).json(dashboards);
  } catch (err) {
    console.error('Error fetching dashboards:', err);
    res.status(500).send({ message: 'Error fetching dashboards' });
  }
};

// Get dashboard by email
exports.getDashboardByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    let dashboard = await Dashboard.findOne({ email });

    if (!dashboard) {
      const defaultDashboard = {
        email: email,
        TotalQuestions: 0,
        TotalCorrect: 0,
        TotalWrong: 0,
        TotalUnanswered: 0,
        TotalTimeAverage: 0,
        games: []
      };

      // Create the new dashboard
      dashboard = new Dashboard(defaultDashboard);
      await dashboard.save();

      return res.status(201).json(dashboard);
    }

    res.status(200).json(dashboard);
  } catch (err) {
    console.error('Error fetching dashboard:', err);
    res.status(500).send({ message: 'Error fetching dashboard' });
  }
};