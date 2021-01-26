// Importing the library
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");

// Creatimg the Schema
const VisitorSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, "First Name is required"],
    trim: true,
    min: [3, "Name must be more than 3 letters"],
  },
  LastName: {
    type: String,
    required: [true, "Last Name is required"],
    trim: true,
    min: [3, "Name must be more than 3 letters"],
    lowercase: true,
  },
  Email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    validate: [validator.isEmail, "Please write proper email Address"],
    unique: [true, "An Email is already present"],
  },
  Password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must contain atleast 8 characters"],
  },
  ConfirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
    validate: {
      validator: function (e) {
        return e === this.Password;
      },
      message: "Please enter the password again.Not matching with the password",
    },
  },
  role: {
    type: String,
    enum: ["Admin", "Visitor"],
    default: "Visitor",
  },
  Address: {
    type: String,
  },
  photo: {
    type: String,
  },
  NewsLetterCheck: {
    type: Boolean,
    default: true,
  },
  termsAccepted: {
    type: Boolean,
  },
  PasswordUpdatedDate: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordTokenExpires: {
    type: Date,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});



// Adding Virtual populate of visitor
VisitorSchema.virtual('CartItems', {
  ref: 'carts',
  foreignField: 'user',
  localField: '_id'
})

// Encrypt the password before inserting the document
VisitorSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcrypt.hash(this.Password, 12);
  this.ConfirmPassword = undefined;
  next();
});

// Password Changed
VisitorSchema.pre("save", function (next) {
  if (!this.isModified("Password") || this.isNew) return next();
  this.PasswordUpdatedDate = Date.now() - 1000;
  next();
});


// At login Time we must compare the password
VisitorSchema.methods.ComparingPassword = async function (
  canditatePassword,
  bodyPassword
) {
  return await bcrypt.compare(canditatePassword, bodyPassword);
};

// Changing the password after the token expires.
VisitorSchema.methods.changePasswordAfter = function (JWTTime) {
  // If the user has changed password
  if (this.PasswordUpdatedDate) {
    const changedTime = parseInt(this.PasswordUpdatedDate.getTime() / 1000, 10);
    return JWTTime < changedTime;
  }
  return false;
};

// Reset the password
VisitorSchema.methods.resetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};


// Creating the model
const VisitorModel = mongoose.model("visitors", VisitorSchema);

//exporting the model
module.exports = VisitorModel;
