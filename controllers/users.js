const { prisma } = require('../prisma/prisma-client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @route POST /api/users/login
 * @desс Login
 * @access Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        const isPasswordCorrect = user && (await bcrypt.compare(password, user.password));
        const secret = process.env.JWT_SECRET;

        if (user && isPasswordCorrect && secret) {
            res.status(200).json({
                id: user.id,
                email: user.email,
                name: user.name,
                token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' })
            })
        } else {
            return res.status(400).json({ message: 'Invalid email or password' })
        }
    } catch {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

/**
 * 
 * @route POST /api/users/register
 * @desc Register
 * @access Public
 */
const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const registeredUser = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (registeredUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassord = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassord
            }
        });

        const secret = process.env.JWT_SECRET;

        if (user && secret) {
            res.status(201).json({
                id: user.id,
                email: user.email,
                name,
                token: jwt.sign({ id: user.id }, secret, { expiresIn: '30d' })
            })
        } else {
            return res.status(400).json({ message: 'Invalid user data' })
        }
    } catch {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

/**
 * 
 * @route GET /api/user/current
 * @desc Current user
 * @access Private
 */
const current = async (req, res, next) => {
    return res.status(200).json(req.user)
}

module.exports = {
    login,
    register,
    current
}