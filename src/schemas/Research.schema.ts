import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Research {
    @Prop({ required: true })
    publishedDate: string;

    @Prop({ required: true })
    authors: string;

    @Prop({ required: true })
    journal: string;

    @Prop({ required: true })
    volume: string;

    @Prop({ required: true })
    issue: string;

    @Prop({ required: true })
    pages: string;
    
    @Prop({ required: true })
    doi: string;

    @Prop({ required: true })
    counter: string;
}

export const ResearchSchema = SchemaFactory.createForClass(Research);