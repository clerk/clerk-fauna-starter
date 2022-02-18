import { withSession } from '@clerk/nextjs/api';

export default withSession((req, res) => {
  if (req.session) {
    res.status(200).json({ id: req.session.userId });
  } else {
    res.status(401).json({ id: null });
  }
});
