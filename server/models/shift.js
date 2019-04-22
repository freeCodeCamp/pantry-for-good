import mongoose from 'mongoose'
import autoIncrement from 'mongoose-plugin-autoinc'
import {modelTypes} from '../../common/constants'

const {Schema} = mongoose

const ShiftSchema = new Schema ({
    filled: {
        type: Boolean,
        default: false,
    },
    volunteer: {
        type: Number,
        ref: modelTypes.VOLUNTEER
    },
    start: {
        type: Date,
        default: Date.now
    },
    end: {
        type: Date,
        default: Date.now
    }
})

ShiftSchema.plugin(autoIncrement, {
    model: modelTypes.SHIFT,
    startAt: 1
})

export default mongoose.model(modelTypes.SHIFT, ShiftSchema)