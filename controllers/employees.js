const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET /api/employees
 * @desc Get all employees
 * @access Private
 */
const all = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany();

        res.status(200).json(employees);
    } catch {
        res.status(500).json({ message: "Something went wrong" });
    }
};

/**
 * @route POST /api/employees/add
 * @desc Add new employee
 * @access Private
 */
const add = async (req, res) => {
    try {
        const data = req.body;

        if (!data.firstName || !data.lastName || !data.address || !data.age) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const employee = await prisma.employee.create({
            data: {
                ...data,
                userId: req.user.id,
            },
        });

        return res.status(201).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

/**
 * @route POST /api/empoyees/remove/:id
 * @desc Delete employee
 * @access Private
 */
const remove = async (req, res) => {
    const { id } = req.body;

    try {
        await prisma.employee.delete({
            where: {
                id,
            },
        });

        res.status(204).json("OK");
    } catch {
        res.status(500).json({ message: "Something went wrong" });
    }
};

/**
 * @route PUT /api/empoyees/edit/:id
 * @desc Edit employee
 * @access Private
 */
const edit = async (req, res) => {
    const data = req.body;
    const id = data.id;

    try {
        await prisma.employee.update({
            where: {
                id,
            },
            data,
        });

        res.status(204).json("OK");
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

/**
 * @route GET /api/employees/:id
 * @desc Get an employee
 * @access Private
 */
const employee = async (req, res) => {
    const { id } = req.params; // http://localhost:8000/api/employees/a7396cdf-c81a-4e95-ad67-2e7853f611d0 / Karina 

    try {
        const employee = await prisma.employee.findUnique({
            where: {
                id,
            },
        });

        res.status(200).json(employee);
    } catch {
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    all,
    add,
    remove,
    edit,
    employee,
};