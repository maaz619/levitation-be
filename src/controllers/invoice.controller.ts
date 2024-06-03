import { NextFunction, Request, Response } from "express";
import { Invoice } from "../models/invoice.model";
import { IToken } from "../utils/auth";
import AppError from "../utils/app-error";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";

async function uploadInvoice(req: Request & { user: IToken }, res: Response, next: NextFunction) {
    try {
        const invoice = new Invoice({
            user: req.user.id,
            ...req.body
        })
        await invoice.save()
        res.status(201).send(invoice);
    } catch (error) {
        next(new AppError(error.message, 400))
    }
}

async function getInvoices(req: Request & { user: IToken }, res: Response, next: NextFunction) {
    try {
        // const { userId } = req.params;
        const invoices = await Invoice.find({ user: req.user.id });
        if (!invoices) {
            throw new AppError('Not found', 404)
        }
        res.send(invoices);
    } catch (error) {
        next(error)
    }
}

async function downloadInvoice(req: Request & { user: IToken }, res: Response, next: NextFunction) {
    try {
        const invoiceData = req.body;
        const templatePath = 'template/invoice.hbs'
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateHtml);
        const html = template(invoiceData);
        const date = new Date()


        res.setHeader('Content-disposition', `attachment; filename=bill-${date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()}.pdf`);
        res.setHeader('Content-type', 'application/pdf');

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate PDF');
    }
}

export { uploadInvoice, getInvoices, downloadInvoice }