var express = require('express');
const upload = require('./multer');
var router = express.Router();
var pool = require("./pool")




router.post('/signup', function (req, res, next) {
    pool.query("insert into users(mobileemail,fullname,password,username,accountstatus) values(?,?,?,?,?)", [req.body.mobileemail, req.body.fullname, req.body.password, req.body.username, 'pending'], function (error, result) {
        if (error) {

            res.status(500).json({ result: false, error })
        }
        else {

            res.status(200).json({ result: true })

        }

    })
});
router.post('/login', function (req, res, next) {
    pool.query("select * from users where (username=?  or mobileemail=?) and password=?", [req.body.username, req.body.mobileemail, req.body.password], function (err, result) {
        if (err) {

            res.status(500).json({ status: false })
        }

        else if (result.length > 0) {


            res.status(200).json({ status: true, data: result[0] })
        }
        else {
            res.status(200).json({ status: false, data: [] })
        }

    })
});
router.post('/editprofile', function (req, res, next) {
    pool.query("update users set mobileemail=? ,fullname=?,username=?,website=?, bio=? where userid=?", [req.body.mobileemail, req.body.fullname, req.body.username, req.body.website, req.body.bio, req.body.userid], function (error, result) {
        if (error) {
            console.log(error)
            res.status(500).json({ result: false, msg: 'Deleted' })
        }
        else {

            console.log(error)
            res.status(200).json({ result: true, msg: 'Edited' })

        }

    })
})
router.post('/userbyuserid', function (req, res, next) {
    console.log(req.body)
    pool.query("select U.*,(select recieveruserid from followrequest F where F.recieveruserid=U.userid and F.senderuserid=?) as requeststatus from users U where U.username=?", [req.body.userid,req.body.username], function (error, result) {
        if (error) {

            res.status(500).json({ status: false })
        }
        else {
            console.log(result)

            res.status(200).json({ status: true, data: result[0] })

        }

    })
});
router.post('/changepassword', function (req, res, next) {
    pool.query("update user set newpassword=? where userid=? and password=?", [req.body.newpassword, req.body.userid, req.body.password], function (error, result) {
        if (error) {

            res.status(500).json({ result: false, error })
        }
        else {

            res.status(200).json({ result: true })

        }

    })
});

router.post('/updateprofile', upload.single('picture'), function (req, res, next) {
    pool.query("update users set picture=? where userid=?", [req.file.filename, req.body.userid], function (error, result) {
        if (error) {
            res.status(500).json({ status: false, data: "" })
        }
        else {
            res.status(200).json({ status: true, data: req.file.filename })
        }
    })
})
router.post('/removephoto', upload.single('picture'), function (req, res, next) {
    pool.query("update users set picture=? where userid=?", ["", req.body.userid], function (error, result) {
        if (error) {
            res.status(500).json({ status: false, data: "" })
        }
        else {
            res.status(200).json({ status: true })
        }
    })
})
router.post('/followrequest', function (req, res, next) {
    pool.query("insert into followrequest(recieveruserid,senderuserid) values(?,?)", [req.body.recieveruserid, req.body.senderuserid], function (error, result) {
        if (error) {

            res.status(500).json({ status: false })
        }
        else {

            res.status(200).json({ status: true })

        }

    })
});
router.post('/deletefollowrequest', function (req, res, next) {
    console.log(req.body)
    pool.query("delete from followrequest where senderuserid=? and recieveruserid=? ", [req.body.senderuserid, req.body.recieveruserid], function (error, result) {
        if (error) {

            res.status(500).json({ status: false })
        }
        else {

            res.status(200).json({ status: true })

        }

    })
});
router.post('/followrequestbyreciever', function (req, res, next) {
    console.log(req.body)
    pool.query("select F.*,U.* from followrequest F ,users U where F.senderuserid=u.userid and F.recieveruserid=?", [req.body.recieveruserid], function (error, result) {
        if (error) {

            res.status(500).json({ status: false,error })
        }
        else {
            console.log(result)

            res.status(200).json({ status: true, data: result })

        }

    })
});
router.post('/getfollowerandfollowing', function (req, res, next) {
   
    pool.query("select count(*) as followers from followers where recieveruserid=?;select count(*) as following from following where senderuserid=?", [req.body.userid,req.body.userid], function (error, result) {
        if (error) {

            res.status(500).json({ status: false })
        }
        else {
            console.log(result)

            res.status(200).json({ status: true, data: result.flat() })

        }

    })
});
router.post('/confirmrequest', function (req, res, next) {
   
    pool.query("insert into followers (recieveruserid,followeruserid) values(?,?);insert into following (senderuserid,followinguserid) values(?,?);delete from followrequest where senderuserid=? and recieveruserid=?", [req.body.recieveruserid,req.body.senderuserid,req.body.senderuserid,req.body.recieveruserid,req.body.senderuserid,req.body.recieveruserid], function (error, result) {
        if (error) {
            console.log(error)

            res.status(500).json({ status: false })
        }
        else {
            console.log(result)

            res.status(200).json({ status: true,  })

        }

    })
});
router.post('/getfollowers', function (req, res, next) {
    pool.query("select * from users where userid in(select followinguserid frpom following where senderuserid=?", [req.body.userid], function (err, result) {
        if (err) {

            res.status(500).json({ status: false })
        }

        else if (result.length > 0) {


            res.status(200).json({ status: true, data: result[0] })
        }
        else {
            res.status(200).json({ status: false, data: [] })
        }

    })
});

router.post('/delete', function (req, res, next) {
    pool.query("delete from posts where postid", [req.body.postid], function (error, result) {
        if (error) {

            res.status(500).json({ status: false })
        }
        else {

            res.status(200).json({ status: true })

        }

    })
});
module.exports = router;