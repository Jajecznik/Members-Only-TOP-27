const db = require('../database/queries');

async function getHomePage(req, res) {
  const showBecomeMember = req.query['show-become-member'] === 'true';
  const showAddNewMessage = req.query['show-add-new-message'] === 'true';
  const showBecomeAdmin = req.query['show-become-admin'] === 'true';
  const messages = await db.getAllMessages();
  const isMember = req.user.membership_status;

  const prcessedMessages = messages.map(msg => {
    if (!isMember) {
      return {
        title: msg.title,
        message: msg.message,
      }
    } else {
      return msg;
    }
  });

  res.render('home', {
    title: 'Home',
    user: req.user,
    showBecomeMember: showBecomeMember,
    showAddNewMessage: showAddNewMessage,
    showBecomeAdmin: showBecomeAdmin,
    messages: prcessedMessages
  });
}

async function handleAdmin(req, res) {
  const password = req.body.secretPassword;

  console.log(password)

  if (password === process.env.ADMIN_PASSWORD) {
    await db.giveUserAdmin(req.user.id);
    res.redirect('/home');
  } else {
    res.redirect('/home?show-become-admin=true');
  }
}

async function handleMembership(req, res) {
  const password = req.body.secretPassword;

  if (password === process.env.MEMBERSHIP_PASSWORD) {
    await db.giveUserMembership(req.user.id);
    res.redirect('/home');
  } else {
    res.redirect('/home?show-become-member=true');
  }
}

async function addNewMessage(req, res) {
  const { messageTitle, messageText } = req.body;

  if (!messageTitle || !messageText) {
    return res.redirect('/home');
  }
  await db.addNewMessage({ title: messageTitle, message: messageText, userId: req.user.id });
  res.redirect('/home');
}

async function deleteMessage(req, res) {
  const messageId = req.params.id;

  if (!req.user.is_admin) {
    return res.status(403).send('Forbidden');
  }

  if (!messageId) {
    return res.status(400).send('Message ID is required');
  }

  try {
    await db.deleteMessage(messageId);
    res.redirect('/home');
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  getHomePage,
  handleAdmin,
  handleMembership,
  addNewMessage,
  deleteMessage
}