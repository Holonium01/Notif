import nodemailer from 'nodemailer';

export default class EmailService {

    constructor(payload) {

      this.time = payload
      this.user = process.env.EMAIL_USERNAME,
      this.pass = process.env.EMAIL_PASSWORD,
      this.email_provide = process.env.EMAIL_PROVIDER 

      this.transporter = nodemailer.createTransport({

        service: this.email_provide,
        auth: {
            user: this.user,
            pass: this.pass
          }
          
        })
    }
    
    async send(payload) {

          this.getMailOptions(payload)

          await this.transporter.sendMail(this.mailOptions)

    }
    close() {
  
      this.transporter.close()
  
    }
    getMailOptions(payload) {


        this.pickup_hour = this.time === 1 ? 'one hour': 'twenty-four hours'

        this.pickup_location = `${payload.pickup_location.address}, ${payload.pickup_location.city}`
  
        this.mailOptions = {
  
          from: this.user,
  
          to: payload.user && payload.user.email,
  
          subject: 'Pickup Notification',
  
          text:`This is to remind you that your order: ${payload._id} from: ${payload.store && payload.store.name} is due for pickup in the next ${this.pickup_hour} at ${this.pickup_location}`
  
        }      
    }
   }
