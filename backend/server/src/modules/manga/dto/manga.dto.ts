import { PartialType } from '@nestjs/swagger';
import { Manga } from '../models/manga.model';

export class MangaDto extends PartialType(Manga) {}
