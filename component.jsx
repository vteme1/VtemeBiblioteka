import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Plus, BookOpen, Headphones, Settings, Moon, Sun, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Star, Trophy, Bookmark, Edit3, Trash2, Download, MessageCircle, Brain, Sparkles, FileText, AudioLines, RefreshCw, ChevronDown, ChevronUp, User, Send, Mic, MicOff, X, Check, AlertCircle, Book, Heart, TrendingUp, Filter, Tag, Calendar, Award, Zap, Crown, Medal, Target, Activity, Link, Upload, Loader } from 'lucide-react';

const { useStoredState } = hatch;

// Ультра-профессиональная система парсинга файлов с расширенными возможностями
class AdvancedFileParser {
  static async parseFile(file, onProgress) {
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    
    try {
      onProgress?.({ 
        status: 'analyzing', 
        progress: 0, 
        message: `Анализирую файл ${fileName} (${this.formatFileSize(fileSize)})...` 
      });
      
      // Проверка размера файла
      if (fileSize > 50 * 1024 * 1024) { // 50MB
        throw new Error('Файл слишком большой (максимум 50MB)');
      }
      
      // Определение типа файла по расширению и содержимому
      const fileType = this.detectFileType(fileName, file);
      
      onProgress?.({ 
        status: 'parsing', 
        progress: 5, 
        message: `Обрабатываю ${fileType.toUpperCase()} файл...` 
      });
      
      let result;
      switch (fileType) {
        case 'epub':
          result = await this.parseEPUB(file, onProgress);
          break;
        case 'fb2':
          result = await this.parseFB2(file, onProgress);
          break;
        case 'txt':
          result = await this.parseTXT(file, onProgress);
          break;
        case 'docx':
          result = await this.parseDOCX(file, onProgress);
          break;
        case 'doc':
          result = await this.parseDOC(file, onProgress);
          break;
        case 'mobi':
          result = await this.parseMOBI(file, onProgress);
          break;
        case 'pdf':
          result = await this.parsePDF(file, onProgress);
          break;
        case 'rtf':
          result = await this.parseRTF(file, onProgress);
          break;
        default:
          throw new Error(`Неподдерживаемый формат файла: ${fileType}`);
      }
      
      // Финальная обработка и валидация
      result = await this.postProcessResult(result, onProgress);
      
      onProgress?.({ 
        status: 'completed', 
        progress: 100, 
        message: `Парсинг завершен! Извлечено ${result.chapters?.length || 0} глав` 
      });
      
      return result;
    } catch (error) {
      console.error('Ошибка парсинга:', error);
      onProgress?.({ 
        status: 'error', 
        progress: 0, 
        message: `Ошибка: ${error.message}` 
      });
      throw error;
    }
  }

  static detectFileType(fileName, file) {
    // Определение по расширению
    if (fileName.endsWith('.epub')) return 'epub';
    if (fileName.endsWith('.fb2')) return 'fb2';
    if (fileName.endsWith('.txt')) return 'txt';
    if (fileName.endsWith('.docx')) return 'docx';
    if (fileName.endsWith('.doc')) return 'doc';
    if (fileName.endsWith('.mobi')) return 'mobi';
    if (fileName.endsWith('.pdf')) return 'pdf';
    if (fileName.endsWith('.rtf')) return 'rtf';
    
    // Определение по MIME-типу
    const mimeType = file.type;
    if (mimeType === 'application/epub+zip') return 'epub';
    if (mimeType === 'application/x-fictionbook+xml') return 'fb2';
    if (mimeType === 'text/plain') return 'txt';
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
    if (mimeType === 'application/msword') return 'doc';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType === 'application/rtf') return 'rtf';
    
    // Fallback по расширению
    const ext = fileName.split('.').pop().toLowerCase();
    const supportedTypes = ['epub', 'fb2', 'txt', 'docx', 'doc', 'mobi', 'pdf', 'rtf'];
    
    if (supportedTypes.includes(ext)) {
      return ext;
    }
    
    throw new Error('Неопределенный тип файла');
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static async postProcessResult(result, onProgress) {
    onProgress?.({ 
      status: 'processing', 
      progress: 95, 
      message: 'Финальная обработка и валидация...' 
    });
    
    // Валидация структуры
    if (!result.title) {
      result.title = 'Без названия';
    }
    
    if (!result.author) {
      result.author = 'Неизвестный автор';
    }
    
    if (!result.chapters || result.chapters.length === 0) {
      throw new Error('Не удалось извлечь содержимое книги');
    }
    
    // Очистка и нормализация
    result.title = this.cleanText(result.title);
    result.author = this.cleanText(result.author);
    result.description = this.cleanText(result.description || '');
    
    // Обработка глав
    result.chapters = result.chapters.map((chapter, index) => ({
      ...chapter,
      title: this.cleanText(chapter.title || `Глава ${index + 1}`),
      content: this.cleanText(chapter.content || ''),
      index: index,
      wordCount: this.countWords(chapter.content || ''),
      estimatedReadingTime: this.estimateReadingTime(chapter.content || '')
    })).filter(chapter => chapter.content.length > 50); // Фильтруем слишком короткие главы
    
    // Добавление метаданных
    result.parsedDate = new Date().toISOString();
    result.totalWordCount = result.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
    result.totalEstimatedTime = this.estimateReadingTime(
      result.chapters.map(ch => ch.content).join(' ')
    );
    
    // Определение жанра по ключевым словам (простая эвристика)
    result.detectedGenres = this.detectGenres(result);
    
    return result;
  }

  static detectGenres(bookData) {
    const text = (bookData.title + ' ' + bookData.description + ' ' + 
                  bookData.chapters.slice(0, 3).map(ch => ch.content.substring(0, 1000)).join(' ')
                 ).toLowerCase();
    
    const genreKeywords = {
      'фантастика': ['космос', 'робот', 'андроид', 'планета', 'галактика', 'будущее', 'технология'],
      'фэнтези': ['магия', 'эльф', 'дракон', 'заклинание', 'волшебник', 'королевство', 'меч'],
      'детектив': ['убийство', 'расследование', 'детектив', 'преступление', 'следователь', 'улика'],
      'роман': ['любовь', 'сердце', 'чувства', 'романтика', 'отношения', 'свадьба'],
      'триллер': ['опасность', 'погоня', 'угроза', 'напряжение', 'выживание', 'страх'],
      'история': ['век', 'война', 'империя', 'король', 'битва', 'исторический'],
      'биография': ['родился', 'жизнь', 'судьба', 'биография', 'мемуары', 'автобиография'],
      'научпоп': ['исследование', 'теория', 'научный', 'открытие', 'эксперимент', 'наука']
    };
    
    const detectedGenres = [];
    
    Object.entries(genreKeywords).forEach(([genre, keywords]) => {
      const score = keywords.reduce((sum, keyword) => {
        const regex = new RegExp(keyword, 'gi');
        return sum + (text.match(regex) || []).length;
      }, 0);
      
      if (score > 2) {
        detectedGenres.push({ genre, confidence: Math.min(1, score / 10) });
      }
    });
    
    return detectedGenres.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }

  // Профессиональный парсинг EPUB
  static async parseEPUB(file, onProgress) {
    onProgress?.({ status: 'parsing', progress: 10, message: 'Загружаю EPUB архив...' });
    
    try {
      // Для полноценного парсинга EPUB нужен JSZip, но мы используем упрощенный подход
      const arrayBuffer = await file.arrayBuffer();
      
      onProgress?.({ status: 'parsing', progress: 25, message: 'Анализирую структуру EPUB...' });
      
      // Пытаемся извлечь текст из архива
      const uint8Array = new Uint8Array(arrayBuffer);
      let extractedText = '';
      
      // Простое извлечение текста из ZIP-подобной структуры
      try {
        extractedText = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
      } catch (e) {
        // Пробуем другие кодировки
        try {
          extractedText = new TextDecoder('windows-1251', { fatal: false }).decode(uint8Array);
        } catch (e2) {
          extractedText = new TextDecoder('iso-8859-1', { fatal: false }).decode(uint8Array);
        }
      }
      
      onProgress?.({ status: 'parsing', progress: 50, message: 'Извлекаю метаданные...' });
      
      // Извлечение метаданных из OPF
      const metadata = this.extractEPUBMetadata(extractedText);
      
      onProgress?.({ status: 'parsing', progress: 70, message: 'Обрабатываю содержимое глав...' });
      
      // Извлекаем HTML контент и очищаем его
      const cleanText = this.extractAndCleanEPUBContent(extractedText);
      
      onProgress?.({ status: 'parsing', progress: 85, message: 'Разбиваю на главы...' });
      
      // Интеллектуальное разбиение на главы
      const chapters = this.intelligentChapterSplit(cleanText);
      
      if (chapters.length === 0) {
        throw new Error('Не удалось извлечь главы из EPUB файла');
      }
      
      return {
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
        author: metadata.author || 'Неизвестный автор',
        description: metadata.description || '',
        language: metadata.language || this.detectLanguage(cleanText),
        subject: metadata.subject || [],
        publisher: metadata.publisher || '',
        date: metadata.date || '',
        identifier: metadata.identifier || '',
        chapters,
        format: 'EPUB',
        originalSize: file.size
      };
    } catch (error) {
      throw new Error(`Ошибка парсинга EPUB: ${error.message}`);
    }
  }

  static extractEPUBMetadata(content) {
    const metadata = {};
    
    // Dublin Core метаданные
    const dcPatterns = {
      title: /<dc:title[^>]*>(.*?)<\/dc:title>/gi,
      author: /<dc:creator[^>]*>(.*?)<\/dc:creator>/gi,
      description: /<dc:description[^>]*>(.*?)<\/dc:description>/gi,
      subject: /<dc:subject[^>]*>(.*?)<\/dc:subject>/gi,
      publisher: /<dc:publisher[^>]*>(.*?)<\/dc:publisher>/gi,
      date: /<dc:date[^>]*>(.*?)<\/dc:date>/gi,
      language: /<dc:language[^>]*>(.*?)<\/dc:language>/gi,
      identifier: /<dc:identifier[^>]*>(.*?)<\/dc:identifier>/gi
    };
    
    Object.entries(dcPatterns).forEach(([key, pattern]) => {
      const matches = [...content.matchAll(pattern)];
      if (matches.length > 0) {
        if (key === 'subject') {
          metadata[key] = matches.map(m => this.cleanText(m[1])).filter(Boolean);
        } else {
          metadata[key] = this.cleanText(matches[0][1]);
        }
      }
    });
    
    // Дополнительные метаданные
    const metaPattern = /<meta\s+name="([^"]+)"\s+content="([^"]+)"/gi;
    const metaMatches = [...content.matchAll(metaPattern)];
    
    metaMatches.forEach(match => {
      const name = match[1].toLowerCase();
      const content = this.cleanText(match[2]);
      
      if (name.includes('author') && !metadata.author) {
        metadata.author = content;
      } else if (name.includes('description') && !metadata.description) {
        metadata.description = content;
      }
    });
    
    return metadata;
  }

  static extractAndCleanEPUBContent(content) {
    // Удаляем служебные данные ZIP архива
    content = content.replace(/PK\x03\x04.*?(?=<)/g, '');
    
    // Извлекаем все HTML/XHTML контент
    const htmlMatches = content.match(/<html[^>]*>[\s\S]*?<\/html>/gi) || [];
    const bodyMatches = content.match(/<body[^>]*>[\s\S]*?<\/body>/gi) || [];
    
    let extractedText = '';
    
    // Обрабатываем найденный HTML
    [...htmlMatches, ...bodyMatches].forEach(htmlBlock => {
      // Удаляем HTML теги, сохраняя структуру
      let cleanBlock = htmlBlock
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Удаляем скрипты
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Удаляем стили
        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '') // Удаляем заголовки
        .replace(/<\/?(h[1-6]|p|div|br|hr)[^>]*>/gi, '\n\n') // Заменяем блочные элементы на переносы
        .replace(/<[^>]+>/g, ' ') // Удаляем остальные теги
        .replace(/&([a-zA-Z0-9#]+);/g, (match, entity) => this.decodeHTMLEntity(entity)) // Декодируем HTML entities
        .replace(/\s+/g, ' ') // Нормализуем пробелы
        .trim();
      
      if (cleanBlock.length > 100) {
        extractedText += cleanBlock + '\n\n';
      }
    });
    
    // Если HTML не найден, пытаемся извлечь любой читаемый текст
    if (extractedText.length < 500) {
      const allText = content
        .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (allText.length > extractedText.length) {
        extractedText = allText;
      }
    }
    
    return extractedText;
  }

  static decodeHTMLEntity(entity) {
    const entities = {
      'amp': '&', 'lt': '<', 'gt': '>', 'quot': '"', 'apos': "'",
      'nbsp': ' ', 'mdash': '—', 'ndash': '–', 'hellip': '…',
      'laquo': '«', 'raquo': '»', 'copy': '©', 'reg': '®',
      'trade': '™', 'deg': '°', 'plusmn': '±', 'frac12': '½'
    };
    
    if (entities[entity]) {
      return entities[entity];
    }
    
    // Числовые entities
    if (entity.startsWith('#')) {
      const code = entity.startsWith('#x') 
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10);
      
      if (!isNaN(code) && code > 0 && code < 1114112) {
        return String.fromCharCode(code);
      }
    }
    
    return ' ';
  }

  // Профессиональный парсинг FB2
  static async parseFB2(file, onProgress) {
    onProgress?.({ status: 'parsing', progress: 15, message: 'Анализирую FB2 файл...' });
    
    const arrayBuffer = await file.arrayBuffer();
    let text = '';
    let detectedEncoding = 'utf-8';
    
    // Интеллектуальное определение кодировки
    const encodings = [
      'utf-8', 'utf-16le', 'utf-16be',
      'windows-1251', 'koi8-r', 'iso-8859-5', 'cp866'
    ];
    
    let bestScore = -1;
    let bestText = '';
    
    onProgress?.({ status: 'parsing', progress: 25, message: 'Определяю оптимальную кодировку...' });
    
    for (const encoding of encodings) {
      try {
        const decoder = new TextDecoder(encoding, { fatal: true });
        const candidateText = decoder.decode(arrayBuffer);
        
        // Проверяем качество декодирования
        if (candidateText.includes('<?xml') && candidateText.includes('<FictionBook')) {
          const score = this.calculateTextQuality(candidateText);
          
          if (score > bestScore) {
            bestScore = score;
            bestText = candidateText;
            detectedEncoding = encoding;
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    text = bestText;
    
    if (!text || !text.includes('<FictionBook')) {
      throw new Error('Некорректный FB2 файл или неподдерживаемая кодировка');
    }
    
    onProgress?.({ status: 'parsing', progress: 40, message: `Кодировка: ${detectedEncoding}. Парсинг XML...` });
    
    // Создаем DOM из XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'application/xml');
    
    // Проверяем на ошибки парсинга
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Ошибка парсинга FB2 XML: ' + parseError.textContent);
    }
    
    onProgress?.({ status: 'parsing', progress: 55, message: 'Извлекаю расширенные метаданные...' });
    
    // Извлекаем полные метаданные
    const metadata = this.extractFB2Metadata(xmlDoc);
    
    onProgress?.({ status: 'parsing', progress: 70, message: 'Обрабатываю структуру книги...' });
    
    // Извлекаем содержимое с учетом вложенности
    const chapters = this.extractFB2Content(xmlDoc);
    
    if (chapters.length === 0) {
      throw new Error('Не удалось извлечь содержимое из FB2 файла');
    }
    
    onProgress?.({ status: 'parsing', progress: 90, message: 'Финализирую обработку...' });
    
    const fullText = chapters.map(ch => ch.content).join(' ');
    
    return {
      title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      author: metadata.authors.join(', ') || 'Неизвестный автор',
      description: metadata.annotation || '',
      chapters,
      genres: metadata.genres,
      language: metadata.language || 'ru',
      date: metadata.date || '',
      translator: metadata.translators.join(', '),
      publisher: metadata.publisher || '',
      series: metadata.series || '',
      sequence: metadata.sequence || '',
      isbn: metadata.isbn || '',
      encoding: detectedEncoding,
      format: 'FB2',
      originalSize: file.size
    };
  }

  static extractFB2Metadata(xmlDoc) {
    const metadata = {
      authors: [],
      translators: [],
      genres: [],
      keywords: []
    };
    
    const titleInfo = xmlDoc.querySelector('title-info');
    const publishInfo = xmlDoc.querySelector('publish-info');
    const documentInfo = xmlDoc.querySelector('document-info');
    
    if (titleInfo) {
      // Название
      metadata.title = this.extractFB2Text(titleInfo, 'book-title');
      
      // Авторы
      const authors = titleInfo.querySelectorAll('author');
      authors.forEach(author => {
        const first = this.extractFB2Text(author, 'first-name') || '';
        const middle = this.extractFB2Text(author, 'middle-name') || '';
        const last = this.extractFB2Text(author, 'last-name') || '';
        const nickname = this.extractFB2Text(author, 'nickname') || '';
        
        const fullName = [first, middle, last].filter(Boolean).join(' ') || nickname;
        if (fullName) {
          metadata.authors.push(fullName);
        }
      });
      
      // Переводчики
      const translators = titleInfo.querySelectorAll('translator');
      translators.forEach(translator => {
        const first = this.extractFB2Text(translator, 'first-name') || '';
        const middle = this.extractFB2Text(translator, 'middle-name') || '';
        const last = this.extractFB2Text(translator, 'last-name') || '';
        
        const fullName = [first, middle, last].filter(Boolean).join(' ');
        if (fullName) {
          metadata.translators.push(fullName);
        }
      });
      
      // Жанры
      const genres = titleInfo.querySelectorAll('genre');
      metadata.genres = Array.from(genres)
        .map(g => g.textContent?.trim())
        .filter(Boolean);
      
      // Аннотация
      const annotation = titleInfo.querySelector('annotation');
      if (annotation) {
        metadata.annotation = this.extractTextFromElement(annotation);
      }
      
      // Ключевые слова
      const keywords = titleInfo.querySelectorAll('keywords');
      metadata.keywords = Array.from(keywords)
        .map(k => k.textContent?.trim())
        .filter(Boolean);
      
      // Язык
      metadata.language = this.extractFB2Text(titleInfo, 'lang') || 'ru';
      
      // Дата написания
      metadata.date = this.extractFB2Text(titleInfo, 'date');
      
      // Серия
      const sequence = titleInfo.querySelector('sequence');
      if (sequence) {
        metadata.series = sequence.getAttribute('name') || '';
        metadata.sequence = sequence.getAttribute('number') || '';
      }
    }
    
    if (publishInfo) {
      // Издательство
      metadata.publisher = this.extractFB2Text(publishInfo, 'publisher');
      
      // ISBN
      metadata.isbn = this.extractFB2Text(publishInfo, 'isbn');
      
      // Год издания
      if (!metadata.date) {
        metadata.date = this.extractFB2Text(publishInfo, 'year');
      }
    }
    
    return metadata;
  }

  static extractFB2Content(xmlDoc) {
    const chapters = [];
    
    // Находим основной контент (body без атрибута name)
    const mainBody = xmlDoc.querySelector('body:not([name])');
    
    if (mainBody) {
      const sections = mainBody.querySelectorAll('section');
      
      if (sections.length > 0) {
        // Обрабатываем каждую секцию как главу
        sections.forEach((section, index) => {
          const chapter = this.processFB2Section(section, index);
          if (chapter && chapter.content.length > 100) {
            chapters.push(chapter);
          }
        });
      } else {
        // Если нет секций, берем весь текст body
        const content = this.extractTextFromElement(mainBody);
        if (content && content.length > 100) {
          chapters.push({
            title: 'Основной текст',
            content: this.cleanText(content),
            index: 0
          });
        }
      }
    }
    
    // Если основной контент пустой, ищем в других body
    if (chapters.length === 0) {
      const allBodies = xmlDoc.querySelectorAll('body');
      allBodies.forEach((body, bodyIndex) => {
        const content = this.extractTextFromElement(body);
        if (content && content.length > 100) {
          chapters.push({
            title: `Часть ${bodyIndex + 1}`,
            content: this.cleanText(content),
            index: bodyIndex
          });
        }
      });
    }
    
    return chapters;
  }

  static processFB2Section(section, index) {
    // Извлекаем заголовок секции
    let title = this.extractSectionTitle(section);
    if (!title) {
      title = `Глава ${index + 1}`;
    }
    
    // Извлекаем содержимое секции
    let content = '';
    
    // Обрабатываем вложенные секции
    const subsections = section.querySelectorAll('section');
    if (subsections.length > 0) {
      subsections.forEach((subsection, subIndex) => {
        const subTitle = this.extractSectionTitle(subsection);
        const subContent = this.extractSectionContent(subsection);
        
        if (subTitle && subTitle !== title) {
          content += `\n\n${subTitle}\n\n`;
        }
        if (subContent) {
          content += subContent + '\n\n';
        }
      });
    } else {
      // Если нет подсекций, извлекаем содержимое напрямую
      content = this.extractSectionContent(section);
    }
    
    return {
      title: this.cleanText(title),
      content: this.cleanText(content),
      index: index
    };
  }

  static extractTextFromElement(element) {
    if (!element) return '';
    
    // Клонируем элемент для безопасной обработки
    const clone = element.cloneNode(true);
    
    // Удаляем служебные элементы
    const serviceTags = ['title', 'epigraph', 'annotation'];
    serviceTags.forEach(tag => {
      const elements = clone.querySelectorAll(tag);
      elements.forEach(el => el.remove());
    });
    
    // Заменяем структурные теги на переносы строк
    const blockTags = ['p', 'v', 'stanza', 'cite', 'subtitle', 'empty-line'];
    blockTags.forEach(tag => {
      const elements = clone.querySelectorAll(tag);
      elements.forEach(el => {
        el.innerHTML = '\n\n' + el.innerHTML + '\n\n';
      });
    });
    
    // Извлекаем текст
    return clone.textContent || '';
  }

  // Профессиональный парсинг TXT
  static async parseTXT(file, onProgress) {
    onProgress?.({ status: 'parsing', progress: 10, message: 'Анализирую текстовый файл...' });
    
    const arrayBuffer = await file.arrayBuffer();
    let text = '';
    let detectedEncoding = 'utf-8';
    
    // Расширенное определение кодировки с BOM поддержкой
    const encodings = [
      'utf-8', 'utf-16le', 'utf-16be',
      'windows-1251', 'windows-1252',
      'koi8-r', 'koi8-u',
      'iso-8859-1', 'iso-8859-5', 'iso-8859-15',
      'cp866', 'cp1251'
    ];
    
    onProgress?.({ status: 'parsing', progress: 25, message: 'Определяю кодировку с анализом BOM...' });
    
    // Проверка BOM (Byte Order Mark)
    const uint8Array = new Uint8Array(arrayBuffer);
    if (uint8Array.length >= 3) {
      // UTF-8 BOM: EF BB BF
      if (uint8Array[0] === 0xEF && uint8Array[1] === 0xBB && uint8Array[2] === 0xBF) {
        text = new TextDecoder('utf-8').decode(arrayBuffer.slice(3));
        detectedEncoding = 'utf-8';
      }
      // UTF-16 LE BOM: FF FE
      else if (uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) {
        text = new TextDecoder('utf-16le').decode(arrayBuffer.slice(2));
        detectedEncoding = 'utf-16le';
      }
      // UTF-16 BE BOM: FE FF
      else if (uint8Array[0] === 0xFE && uint8Array[1] === 0xFF) {
        text = new TextDecoder('utf-16be').decode(arrayBuffer.slice(2));
        detectedEncoding = 'utf-16be';
      }
    }
    
    // Если BOM не найден, используем эвристический анализ
    if (!text) {
      let bestScore = -1;
      let bestText = '';
      
      for (const encoding of encodings) {
        try {
          const decoder = new TextDecoder(encoding, { fatal: true });
          const candidateText = decoder.decode(arrayBuffer);
          
          const score = this.calculateTextQualityAdvanced(candidateText);
          
          if (score > bestScore) {
            bestScore = score;
            bestText = candidateText;
            detectedEncoding = encoding;
          }
        } catch (e) {
          continue;
        }
      }
      
      text = bestText;
    }
    
    if (!text || text.length < 10) {
      throw new Error('Не удалось декодировать текстовый файл');
    }
    
    onProgress?.({ status: 'parsing', progress: 45, message: `Кодировка: ${detectedEncoding}. Извлекаю метаданные...` });
    
    // Извлечение метаданных из структуры текста
    const metadata = this.extractTXTMetadata(text, file.name);
    
    onProgress?.({ status: 'parsing', progress: 65, message: 'Анализирую структуру документа...' });
    
    // Предварительная очистка текста
    const cleanedText = this.preprocessText(text);
    
    onProgress?.({ status: 'parsing', progress: 80, message: 'Интеллектуальное разбиение на главы...' });
    
    // Улучшенное разбиение на главы
    const chapters = this.intelligentChapterSplitAdvanced(cleanedText);
    
    if (chapters.length === 0) {
      throw new Error('Не удалось извлечь содержимое из текстового файла');
    }
    
    return {
      title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      author: metadata.author || 'Неизвестный автор',
      description: metadata.description || '',
      chapters,
      encoding: detectedEncoding,
      language: metadata.language || this.detectLanguage(text),
      originalFormat: metadata.format || 'Plain Text',
      originalSize: file.size,
      format: 'TXT'
    };
  }

  static calculateTextQualityAdvanced(text) {
    if (!text || text.length < 50) return 0;
    
    let score = 0;
    
    // Базовая оценка читаемых символов
    const readableChars = text.match(/[a-zA-Zа-яёА-ЯЁ0-9\s.,!?;:'"()\-]/g) || [];
    const readableRatio = readableChars.length / text.length;
    score += readableRatio * 0.4;
    
    // Оценка языков
    const russianChars = text.match(/[а-яёА-ЯЁ]/g) || [];
    const englishChars = text.match(/[a-zA-Z]/g) || [];
    const totalLetters = russianChars.length + englishChars.length;
    
    if (totalLetters > 0) {
      const russianRatio = russianChars.length / totalLetters;
      const englishRatio = englishChars.length / totalLetters;
      
      // Бонус за доминирующий язык
      if (russianRatio > 0.7) score += 0.3;
      else if (englishRatio > 0.7) score += 0.2;
      else if (russianRatio > 0.3 && englishRatio > 0.3) score += 0.1; // Смешанный текст
    }
    
    // Проверка на структуру предложений
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
      if (avgSentenceLength > 20 && avgSentenceLength < 200) score += 0.2;
    }
    
    // Штрафы
    if (text.match(/(.)\1{10,}/)) score -= 0.3; // Повторяющиеся символы
    if (text.match(/[^\x20-\x7E\u00A0-\uFFFF]{10,}/)) score -= 0.2; // Много нечитаемых символов
    
    return Math.max(0, Math.min(1, score));
  }

  static extractTXTMetadata(text, fileName) {
    const metadata = {};
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Поиск заголовка в первых строках
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      
      if (line.length > 5 && line.length < 150) {
        // Проверяем, похоже ли на заголовок
        const isTitle = (
          i < 3 && // В первых трех строках
          !line.includes('.') && // Не содержит точек
          line.length > 10 && // Достаточно длинная
          line.match(/[A-ZА-Я]/) && // Содержит заглавные буквы
          !line.match(/^(глава|chapter|часть|part)\s+\d/i) // Не номер главы
        );
        
        if (isTitle && !metadata.title) {
          metadata.title = line;
        }
      }
    }
    
    // Поиск автора
    const authorPatterns = [
      /^автор[:\s]+(.+)$/i,
      /^написал[:\s]+(.+)$/i,
      /^author[:\s]+(.+)$/i,
      /^by[:\s]+(.+)$/i,
      /^(.+)\s*—\s*автор$/i,
      /©\s*(.+)$/i
    ];
    
    for (const line of lines.slice(0, 20)) {
      for (const pattern of authorPatterns) {
        const match = line.match(pattern);
        if (match && !metadata.author) {
          metadata.author = match[1].trim();
          break;
        }
      }
      if (metadata.author) break;
    }
    
    // Поиск аннотации/описания
    const descPatterns = [
      /^(аннотация|описание|summary|abstract)[:\s]*(.+)$/i,
      /^о\s+книге[:\s]*(.+)$/i
    ];
    
    for (const line of lines.slice(0, 30)) {
      for (const pattern of descPatterns) {
        const match = line.match(pattern);
        if (match && !metadata.description) {
          metadata.description = match[2].trim();
          break;
        }
      }
      if (metadata.description) break;
    }
    
    // Определение формата по структуре
    if (text.includes('<?xml') || text.includes('<html>')) {
      metadata.format = 'XML/HTML Text';
    } else if (text.includes('\\documentclass') || text.includes('\\begin{document}')) {
      metadata.format = 'LaTeX Document';
    } else if (text.match(/^#{1,6}\s/m)) {
      metadata.format = 'Markdown Document';
    } else {
      metadata.format = 'Plain Text';
    }
    
    return metadata;
  }

  static preprocessText(text) {
    // Нормализация переносов строк
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Удаление лишних пробелов и табуляций
    text = text.replace(/[ \t]+/g, ' ');
    
    // Нормализация множественных переносов
    text = text.replace(/\n{4,}/g, '\n\n\n');
    
    // Удаление служебных символов
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    return text.trim();
  }

  static intelligentChapterSplitAdvanced(text) {
    const chapters = [];
    
    // Расширенные паттерны для определения глав
    const chapterPatterns = [
      // Русские паттерны
      {
        pattern: /^(ГЛАВА|Глава|глава)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: 'numbered'
      },
      {
        pattern: /^(ЧАСТЬ|Часть|часть)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: 'numbered'
      },
      {
        pattern: /^(РАЗДЕЛ|Раздел|раздел)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: 'numbered'
      },
      // Английские паттерны
      {
        pattern: /^(CHAPTER|Chapter|chapter)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: 'numbered'
      },
      {
        pattern: /^(PART|Part|part)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: 'numbered'
      },
      // Специальные паттерны
      {
        pattern: /^(\d+)\.\s*([А-ЯЁA-Z])/gm,
        type: 'numbered'
      },
      {
        pattern: /^\*{3,}\s*([А-ЯЁA-Z].*?)\s*\*{3,}$/gm,
        type: 'decorated'
      },
      {
        pattern: /^={3,}\s*([А-ЯЁA-Z].*?)\s*={3,}$/gm,
        type: 'decorated'
      },
      {
        pattern: /^-{3,}\s*([А-ЯЁA-Z].*?)\s*-{3,}$/gm,
        type: 'decorated'
      }
    ];
    
    let bestSplit = null;
    let maxChapters = 0;
    let bestType = null;
    
    // Ищем лучший паттерн для разбиения
    for (const { pattern, type } of chapterPatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > maxChapters && matches.length > 1) {
        maxChapters = matches.length;
        bestSplit = matches;
        bestType = type;
      }
    }
    
    if (bestSplit && bestSplit.length > 1) {
      // Разбиваем по найденным заголовкам
      for (let i = 0; i < bestSplit.length; i++) {
        const start = bestSplit[i].index;
        const end = i + 1 < bestSplit.length ? bestSplit[i + 1].index : text.length;
        const chapterText = text.slice(start, end).trim();
        
        if (chapterText.length > 200) {
          const lines = chapterText.split('\n');
          const title = this.extractChapterTitle(lines[0], bestType) || `Глава ${i + 1}`;
          const content = lines.slice(1).join('\n').trim() || chapterText;
          
          chapters.push({
            title: this.cleanText(title),
            content: this.cleanText(content),
            index: i,
            type: bestType
          });
        }
      }
    }
    
    // Если не нашли главы, используем семантическое разбиение
    if (chapters.length === 0) {
      const semanticChapters = this.semanticChapterSplit(text);
      chapters.push(...semanticChapters);
    }
    
    // Если всё ещё нет глав, разбиваем по размеру
    if (chapters.length === 0) {
      const sizeBasedChapters = this.sizeBasedChapterSplit(text);
      chapters.push(...sizeBasedChapters);
    }
    
    return chapters.filter(ch => ch.content.length > 100);
  }

  static extractChapterTitle(titleLine, type) {
    if (type === 'numbered') {
      return titleLine.replace(/^(ГЛАВА|Глава|глава|CHAPTER|Chapter|chapter|ЧАСТЬ|Часть|часть|PART|Part|part|РАЗДЕЛ|Раздел|раздел)\s*/i, '');
    }
    
    if (type === 'decorated') {
      return titleLine.replace(/^[*=-]{3,}\s*|\s*[*=-]{3,}$/g, '');
    }
    
    return titleLine;
  }

  static semanticChapterSplit(text) {
    const chapters = [];
    const paragraphs = text.split(/\n\s*\n/);
    
    if (paragraphs.length < 10) {
      return [];
    }
    
    // Группируем параграфы в главы по семантическим признакам
    let currentChapter = [];
    let chapterIndex = 0;
    
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      
      if (paragraph.length < 50) continue;
      
      // Проверяем, начинается ли новая глава
      const isNewChapter = (
        currentChapter.length > 5 && // Минимум 5 параграфов в главе
        (
          paragraph.match(/^[А-ЯЁA-Z].*[.!?]$/m) || // Заглавная буква + точка
          paragraph.length < 200 && currentChapter.length > 10 // Короткий параграф после длинной главы
        )
      );
      
      if (isNewChapter && currentChapter.length > 0) {
        const chapterText = currentChapter.join('\n\n');
        if (chapterText.length > 500) {
          chapters.push({
            title: `Часть ${chapterIndex + 1}`,
            content: this.cleanText(chapterText),
            index: chapterIndex,
            type: 'semantic'
          });
          chapterIndex++;
        }
        currentChapter = [];
      }
      
      currentChapter.push(paragraph);
    }
    
    // Добавляем последнюю главу
    if (currentChapter.length > 0) {
      const chapterText = currentChapter.join('\n\n');
      if (chapterText.length > 500) {
        chapters.push({
          title: `Часть ${chapterIndex + 1}`,
          content: this.cleanText(chapterText),
          index: chapterIndex,
          type: 'semantic'
        });
      }
    }
    
    return chapters;
  }

  static sizeBasedChapterSplit(text) {
    const chapters = [];
    const words = text.split(/\s+/);
    const totalWords = words.length;
    
    if (totalWords < 1000) {
      return [{
        title: 'Основной текст',
        content: this.cleanText(text),
        index: 0,
        type: 'single'
      }];
    }
    
    // Определяем оптимальный размер главы
    const targetChapters = Math.min(20, Math.max(3, Math.floor(totalWords / 2000)));
    const wordsPerChapter = Math.floor(totalWords / targetChapters);
    
    let currentChapter = [];
    let chapterIndex = 0;
    
    for (let i = 0; i < words.length; i++) {
      currentChapter.push(words[i]);
      
      if (currentChapter.length >= wordsPerChapter || i === words.length - 1) {
        // Ищем ближайший конец предложения
        for (let j = i; j < Math.min(i + 100, words.length); j++) {
          if (words[j].match(/[.!?]$/)) {
            // Добавляем слова до конца предложения
            while (i < j) {
              i++;
              if (i < words.length) {
                currentChapter.push(words[i]);
              }
            }
            break;
          }
        }
        
        const chapterText = currentChapter.join(' ').trim();
        if (chapterText.length > 200) {
          chapters.push({
            title: `Часть ${chapterIndex + 1}`,
            content: this.cleanText(chapterText),
            index: chapterIndex,
            type: 'size-based'
          });
          chapterIndex++;
        }
        
        currentChapter = [];
      }
    }
    
    return chapters;
  }

  // Профессиональный парсинг DOCX
  static async parseDOCX(file, onProgress) {
    onProgress?.({ status: 'parsing', progress: 15, message: 'Анализирую DOCX структуру...' });
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      onProgress?.({ status: 'parsing', progress: 30, message: 'Извлекаю содержимое из ZIP архива...' });
      
      // DOCX - это ZIP архив, пытаемся извлечь document.xml
      const uint8Array = new Uint8Array(arrayBuffer);
      let documentXML = '';
      let coreProperties = '';
      
      // Простое извлечение XML из ZIP-подобной структуры
      const textContent = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
      
      // Ищем document.xml содержимое
      const documentMatch = textContent.match(/document\.xml[\s\S]*?<\/w:document>/);
      if (documentMatch) {
        documentXML = documentMatch[0];
      }
      
      // Ищем core.xml для метаданных
      const coreMatch = textContent.match(/core\.xml[\s\S]*?<\/cp:coreProperties>/);
      if (coreMatch) {
        coreProperties = coreMatch[0];
      }
      
      onProgress?.({ status: 'parsing', progress: 50, message: 'Извлекаю метаданные документа...' });
      
      // Извлекаем метаданные
      const metadata = this.extractDOCXMetadata(coreProperties, textContent);
      
      onProgress?.({ status: 'parsing', progress: 70, message: 'Обрабатываю текстовое содержимое...' });
      
      // Извлекаем текст из Word XML
      let extractedText = '';
      
      if (documentXML) {
        extractedText = this.extractTextFromWordXML(documentXML);
      }
      
      // Fallback - извлечение всех w:t тегов
      if (!extractedText || extractedText.length < 100) {
        const textMatches = textContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
        extractedText = textMatches
          .map(match => {
            const content = match.replace(/<[^>]*>/g, '');
            return this.decodeHTMLEntity(content);
          })
          .join(' ');
      }
      
      // Если всё ещё мало текста, используем более агрессивный подход
      if (!extractedText || extractedText.length < 100) {
        const allText = textContent
          .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Ищем самую длинную последовательность читаемого текста
        const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 20);
        extractedText = sentences.join('. ');
      }
      
      if (!extractedText || extractedText.length < 50) {
        throw new Error('Не удалось извлечь текстовое содержимое из DOCX файла');
      }
      
      onProgress?.({ status: 'parsing', progress: 85, message: 'Разбиваю на главы...' });
      
      // Обрабатываем извлеченный текст
      const cleanedText = this.cleanText(extractedText);
      const chapters = this.intelligentChapterSplitAdvanced(cleanedText);
      
      if (chapters.length === 0) {
        chapters.push({
          title: 'Документ',
          content: cleanedText,
          index: 0
        });
      }
      
      return {
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
        author: metadata.author || 'Неизвестный автор',
        description: metadata.description || metadata.subject || '',
        chapters,
        language: metadata.language || this.detectLanguage(cleanedText),
        creator: metadata.creator || '',
        lastModifiedBy: metadata.lastModifiedBy || '',
        created: metadata.created || '',
        modified: metadata.modified || '',
        format: 'DOCX',
        originalSize: file.size
      };
    } catch (error) {
      throw new Error(`Ошибка парсинга DOCX: ${error.message}`);
    }
  }

  static extractDOCXMetadata(coreProperties, fullContent) {
    const metadata = {};
    
    if (coreProperties) {
      // Извлекаем основные метаданные
      const patterns = {
        title: /<dc:title[^>]*>(.*?)<\/dc:title>/i,
        author: /<dc:creator[^>]*>(.*?)<\/dc:creator>/i,
        description: /<dc:description[^>]*>(.*?)<\/dc:description>/i,
        subject: /<dc:subject[^>]*>(.*?)<\/dc:subject>/i,
        creator: /<cp:lastModifiedBy[^>]*>(.*?)<\/cp:lastModifiedBy>/i,
        created: /<dcterms:created[^>]*>(.*?)<\/dcterms:created>/i,
        modified: /<dcterms:modified[^>]*>(.*?)<\/dcterms:modified>/i,
        language: /<dc:language[^>]*>(.*?)<\/dc:language>/i
      };
      
      Object.entries(patterns).forEach(([key, pattern]) => {
        const match = coreProperties.match(pattern);
        if (match) {
          metadata[key] = this.cleanText(match[1]);
        }
      });
    }
    
    // Дополнительный поиск в свойствах приложения
    const appPropsMatch = fullContent.match(/app\.xml[\s\S]*?<\/Properties>/);
    if (appPropsMatch) {
      const appProps = appPropsMatch[0];
      
      if (!metadata.author) {
        const authorMatch = appProps.match(/<Company[^>]*>(.*?)<\/Company>/i);
        if (authorMatch) metadata.author = this.cleanText(authorMatch[1]);
      }
      
      if (!metadata.title) {
        const titleMatch = appProps.match(/<TitlesOfParts[^>]*>(.*?)<\/TitlesOfParts>/i);
        if (titleMatch) metadata.title = this.cleanText(titleMatch[1]);
      }
    }
    
    return metadata;
  }

  static extractTextFromWordXML(documentXML) {
    // Удаляем служебные элементы
    let cleanXML = documentXML
      .replace(/<w:instrText[^>]*>[\s\S]*?<\/w:instrText>/g, '') // Удаляем поля
      .replace(/<w:fldChar[^>]*>/g, '') // Удаляем символы полей
      .replace(/<w:endnoteReference[^>]*\/>/g, '') // Удаляем ссылки на сноски
      .replace(/<w:footnoteReference[^>]*\/>/g, '') // Удаляем ссылки на сноски
      .replace(/<w:commentRangeStart[^>]*\/>/g, '') // Удаляем комментарии
      .replace(/<w:commentRangeEnd[^>]*\/>/g, '')
      .replace(/<w:commentReference[^>]*\/>/g, '');
    
    // Извлекаем текстовые элементы с сохранением структуры
    const paragraphMatches = cleanXML.match(/<w:p[^>]*>[\s\S]*?<\/w:p>/g) || [];
    
    let extractedText = '';
    
    paragraphMatches.forEach(paragraph => {
      // Извлекаем все текстовые узлы из параграфа
      const textNodes = paragraph.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
      
      let paragraphText = '';
      textNodes.forEach(textNode => {
        const content = textNode.replace(/<[^>]*>/g, '');
        paragraphText += content;
      });
      
      if (paragraphText.trim()) {
        extractedText += paragraphText + '\n\n';
      }
    });
    
    // Если параграфы не найдены, извлекаем все w:t элементы
    if (!extractedText || extractedText.length < 100) {
      const allTextNodes = cleanXML.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
      extractedText = allTextNodes
        .map(node => node.replace(/<[^>]*>/g, ''))
        .join(' ');
    }
    
    return extractedText.trim();
  }

  // Улучшенный парсинг DOC
  static async parseDOC(file, onProgress) {
    onProgress?.({ status: 'parsing', progress: 20, message: 'Анализирую DOC файл...' });
    
    const arrayBuffer = await file.arrayBuffer();
    
    // DOC файлы имеют сложную бинарную структуру
    // Попытка извлечения текста из бинарных данных
    const view = new DataView(arrayBuffer);
    let text = '';
    
    // Простое извлечение текста (для полноценного парсинга нужна специализированная библиотека)
    for (let i = 0; i < arrayBuffer.byteLength - 1; i++) {
      const byte = view.getUint8(i);
      if (byte >= 32 && byte <= 126) { // Печатные ASCII символы
        text += String.fromCharCode(byte);
      } else if (byte === 0) {
        text += ' ';
      }
    }
    
    // Очистка извлеченного текста
    text = text.replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    onProgress?.({ status: 'parsing', progress: 80, message: 'Обрабатываю содержимое...' });
    
    const result = this.processTextContent(text, file.name);
    
    onProgress?.({ status: 'parsing', progress: 100, message: 'DOC парсинг завершен!' });
    
    return result;
  }

  // Улучшенный парсинг MOBI
  static async parseMOBI(file, onProgress) {
    onProgress?.({ status: 'parsing', progress: 20, message: 'Анализирую MOBI файл...' });
    
    const arrayBuffer = await file.arrayBuffer();
    const view = new DataView(arrayBuffer);
    
    // Проверяем MOBI заголовок
    const mobiHeader = new TextDecoder('ascii').decode(arrayBuffer.slice(60, 68));
    if (mobiHeader !== 'BOOKMOBI') {
      throw new Error('Неверный формат MOBI файла');
    }
    
    onProgress?.({ status: 'parsing', progress: 50, message: 'Извлекаю метаданные...' });
    
    // Извлекаем базовую информацию
    let title = file.name.replace(/\.[^/.]+$/, "");
    let author = 'Неизвестный автор';
    
    // Попытка извлечения текста (упрощенная)
    let text = '';
    for (let i = 0; i < arrayBuffer.byteLength - 1; i++) {
      const byte = view.getUint8(i);
      if (byte >= 32 && byte <= 126) {
        text += String.fromCharCode(byte);
      } else if (byte === 0) {
        text += ' ';
      }
    }
    
    // Очистка от служебных MOBI данных
    text = text.replace(/BOOKMOBI|EXTH|MOBI|PDB/g, '')
      .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    onProgress?.({ status: 'parsing', progress: 80, message: 'Обрабатываю содержимое...' });
    
    const result = this.processTextContent(text, file.name);
    
    onProgress?.({ status: 'parsing', progress: 100, message: 'MOBI парсинг завершен!' });
    
    return result;
  }

  // Профессиональный парсинг PDF с улучшенным извлечением
  static async parsePDF(file, onProgress) {
    onProgress?.({ status: 'parsing', progress: 10, message: 'Анализирую PDF структуру...' });
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      onProgress?.({ status: 'parsing', progress: 25, message: 'Ищу текстовые потоки...' });
      
      // Расширенное извлечение PDF текста
      let extractedText = '';
      const pdfText = new TextDecoder('latin1').decode(uint8Array);
      
      // Ищем текстовые объекты в PDF
      const textObjectMatches = pdfText.match(/BT\s*[\s\S]*?ET/g) || [];
      const streamMatches = pdfText.match(/stream[\s\S]*?endstream/g) || [];
      
      onProgress?.({ status: 'parsing', progress: 50, message: 'Извлекаю текст из объектов...' });
      
      // Обработка текстовых объектов
      textObjectMatches.forEach(textObj => {
        // Ищем команды вывода текста
        const textCommands = textObj.match(/\([^)]*\)\s*Tj|\[[^\]]*\]\s*TJ/g) || [];
        textCommands.forEach(cmd => {
          const textMatch = cmd.match(/\(([^)]*)\)|\[([^\]]*)\]/);
          if (textMatch) {
            const text = textMatch[1] || textMatch[2];
            if (text) {
              extractedText += this.decodePDFText(text) + ' ';
            }
          }
        });
      });
      
      // Обработка потоков
      streamMatches.forEach(stream => {
        const content = stream.replace(/^stream\s*|\s*endstream$/g, '');
        // Попытка декодирования как текст
        try {
          const decoded = this.decodePDFStream(content);
          if (decoded && decoded.length > 10) {
            extractedText += decoded + ' ';
          }
        } catch (e) {
          // Игнорируем ошибки декодирования
        }
      });
      
      onProgress?.({ status: 'parsing', progress: 70, message: 'Очищаю и нормализую текст...' });
      
      // Очистка извлеченного текста
      extractedText = extractedText
        .replace(/\\[0-9]{3}/g, ' ') // Октальные коды
        .replace(/\\[nrtbf]/g, ' ') // Escape последовательности
        .replace(/\s+/g, ' ')
        .trim();
      
      // Fallback к простому извлечению если основной метод не дал результата
      if (extractedText.length < 100) {
        extractedText = this.extractPDFTextFallback(uint8Array);
      }
      
      onProgress?.({ status: 'parsing', progress: 85, message: 'Извлекаю метаданные...' });
      
      // Извлечение метаданных PDF
      const metadata = this.extractPDFMetadata(pdfText);
      
      onProgress?.({ status: 'parsing', progress: 95, message: 'Разбиваю на главы...' });
      
      const chapters = this.intelligentChapterSplitAdvanced(extractedText);
      
      if (chapters.length === 0) {
        throw new Error('Не удалось извлечь читаемый текст из PDF файла');
      }
      
      return {
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
        author: metadata.author || 'Неизвестный автор',
        description: metadata.subject || metadata.keywords || '',
        chapters,
        creator: metadata.creator || '',
        producer: metadata.producer || '',
        creationDate: metadata.creationDate || '',
        language: this.detectLanguage(extractedText),
        format: 'PDF',
        originalSize: file.size,
        pdfVersion: metadata.version || ''
      };
    } catch (error) {
      throw new Error(`Ошибка парсинга PDF: ${error.message}`);
    }
  }

  static decodePDFText(text) {
    // Декодирование PDF текста с учетом кодировок
    return text
      .replace(/\\([0-7]{3})/g, (match, octal) => {
        const charCode = parseInt(octal, 8);
        return String.fromCharCode(charCode);
      })
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\\\/g, '\\')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')');
  }

  static decodePDFStream(content) {
    // Простое декодирование потока (без сжатия)
    const cleanContent = content
      .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return cleanContent.length > 50 ? cleanContent : '';
  }

  static extractPDFTextFallback(uint8Array) {
    let text = '';
    let inTextObject = false;
    
    // Более умное извлечение текста
    const pdfString = new TextDecoder('latin1', { fatal: false }).decode(uint8Array);
    
    // Ищем читаемые последовательности
    const readableChunks = pdfString.match(/[\x20-\x7E\u00A0-\uFFFF]{10,}/g) || [];
    
    readableChunks.forEach(chunk => {
      // Фильтруем PDF служебную информацию
      if (!chunk.match(/^(obj|endobj|stream|endstream|xref|trailer|%%PDF|startxref)/) &&
          chunk.length > 20 && 
          chunk.match(/[a-zA-Zа-яА-Я]/)) {
        text += chunk + ' ';
      }
    });
    
    return text.replace(/\s+/g, ' ').trim();
  }

  static extractPDFMetadata(pdfContent) {
    const metadata = {};
    
    // Извлечение метаданных из Info объекта
    const infoMatch = pdfContent.match(/\/Info\s*<<([^>]*)>>/s);
    if (infoMatch) {
      const infoContent = infoMatch[1];
      
      const patterns = {
        title: /\/Title\s*\(([^)]*)\)/,
        author: /\/Author\s*\(([^)]*)\)/,
        subject: /\/Subject\s*\(([^)]*)\)/,
        keywords: /\/Keywords\s*\(([^)]*)\)/,
        creator: /\/Creator\s*\(([^)]*)\)/,
        producer: /\/Producer\s*\(([^)]*)\)/,
        creationDate: /\/CreationDate\s*\(([^)]*)\)/
      };
      
      Object.entries(patterns).forEach(([key, pattern]) => {
        const match = infoContent.match(pattern);
        if (match) {
          metadata[key] = this.decodePDFText(match[1]);
        }
      });
    }
    
    // Извлечение версии PDF
    const versionMatch = pdfContent.match(/%PDF-([0-9.]+)/);
    if (versionMatch) {
      metadata.version = versionMatch[1];
    }
    
    return metadata;
  }

  // Профессиональный парсинг RTF с улучшенной очисткой
  static async parseRTF(file, onProgress) {
    onProgress?.({ status: 'parsing', progress: 15, message: 'Анализирую RTF структуру...' });
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Определение кодировки RTF
      let text = '';
      const encodings = ['utf-8', 'windows-1251', 'windows-1252', 'iso-8859-1'];
      
      for (const encoding of encodings) {
        try {
          const decoder = new TextDecoder(encoding, { fatal: true });
          text = decoder.decode(arrayBuffer);
          if (text.includes('{\\rtf')) break;
        } catch (e) {
          continue;
        }
      }
      
      if (!text.includes('{\\rtf')) {
        throw new Error('Неверный формат RTF файла');
      }
      
      onProgress?.({ status: 'parsing', progress: 30, message: 'Извлекаю метаданные RTF...' });
      
      // Извлечение метаданных RTF
      const metadata = this.extractRTFMetadata(text);
      
      onProgress?.({ status: 'parsing', progress: 50, message: 'Очищаю RTF разметку...' });
      
      // Продвинутая очистка RTF
      let cleanText = this.cleanRTFAdvanced(text);
      
      onProgress?.({ status: 'parsing', progress: 70, message: 'Нормализую текст...' });
      
      // Дополнительная очистка и нормализация
      cleanText = this.preprocessText(cleanText);
      
      onProgress?.({ status: 'parsing', progress: 85, message: 'Разбиваю на главы...' });
      
      const chapters = this.intelligentChapterSplitAdvanced(cleanText);
      
      if (chapters.length === 0) {
        throw new Error('Не удалось извлечь содержимое из RTF файла');
      }
      
      return {
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
        author: metadata.author || 'Неизвестный автор',
        description: metadata.subject || metadata.keywords || '',
        chapters,
        category: metadata.category || '',
        company: metadata.company || '',
        manager: metadata.manager || '',
        keywords: metadata.keywords || '',
        language: this.detectLanguage(cleanText),
        format: 'RTF',
        originalSize: file.size
      };
    } catch (error) {
      throw new Error(`Ошибка парсинга RTF: ${error.message}`);
    }
  }

  static extractRTFMetadata(rtfContent) {
    const metadata = {};
    
    // RTF информационные группы
    const infoPatterns = {
      title: /\\title\s*([^\\}]+)/,
      author: /\\author\s*([^\\}]+)/,
      subject: /\\subject\s*([^\\}]+)/,
      keywords: /\\keywords\s*([^\\}]+)/,
      comments: /\\doccomm\s*([^\\}]+)/,
      category: /\\category\s*([^\\}]+)/,
      company: /\\company\s*([^\\}]+)/,
      manager: /\\manager\s*([^\\}]+)/
    };
    
    Object.entries(infoPatterns).forEach(([key, pattern]) => {
      const match = rtfContent.match(pattern);
      if (match) {
        metadata[key] = this.cleanText(match[1]);
      }
    });
    
    return metadata;
  }

  static cleanRTFAdvanced(rtfText) {
    let text = rtfText;
    
    // Удаление RTF заголовка
    text = text.replace(/\{\\rtf[^}]*\}/, '');
    
    // Удаление шрифтовой таблицы
    text = text.replace(/\{\\fonttbl[^}]*\}/g, '');
    
    // Удаление цветовой таблицы
    text = text.replace(/\{\\colortbl[^}]*\}/g, '');
    
    // Удаление стилей
    text = text.replace(/\{\\stylesheet[^}]*\}/g, '');
    
    // Удаление информационных групп
    text = text.replace(/\{\\info[^}]*\}/g, '');
    
    // Обработка Unicode символов
    text = text.replace(/\\u(\d+)\??/g, (match, code) => {
      const charCode = parseInt(code);
      return charCode > 0 ? String.fromCharCode(charCode) : '';
    });
    
    // Замена RTF команд на соответствующие символы
    const rtfReplacements = {
      '\\par': '\n\n',
      '\\line': '\n',
      '\\tab': '\t',
      '\\lquote': "'",
      '\\rquote': "'",
      '\\ldblquote': '"',
      '\\rdblquote': '"',
      '\\endash': '–',
      '\\emdash': '—',
      '\\bullet': '•',
      '\\ ': ' ', // Неразрывный пробел
      '\\~': ' ' // Неразрывный пробел
    };
    
    Object.entries(rtfReplacements).forEach(([rtfCmd, replacement]) => {
      text = text.replace(new RegExp(rtfCmd.replace(/[\\]/g, '\\\\'), 'g'), replacement);
    });
    
    // Удаление остальных RTF команд
    text = text.replace(/\\[a-z]+\d*\s?/gi, '');
    
    // Обработка групп
    text = text.replace(/\{([^{}]*)\}/g, '$1');
    
    // Удаление экранированных символов
    text = text.replace(/\\(.)/g, '$1');
    
    // Нормализация пробелов
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  // Система анализа качества парсинга
  static analyzeParsingQuality(result) {
    const quality = {
      score: 0,
      issues: [],
      recommendations: [],
      confidence: 0
    };
    
    // Проверка количества глав
    if (result.chapters && result.chapters.length > 0) {
      quality.score += 25;
      
      if (result.chapters.length > 50) {
        quality.issues.push('Слишком много глав - возможно неправильное разбиение');
        quality.recommendations.push('Проверьте настройки разбиения на главы');
      } else if (result.chapters.length === 1 && result.chapters[0].content.length > 50000) {
        quality.issues.push('Книга не разбита на главы');
        quality.recommendations.push('Попробуйте другой метод разбиения');
      }
    } else {
      quality.issues.push('Не удалось извлечь главы');
    }
    
    // Проверка метаданных
    if (result.title && result.title !== 'Без названия') {
      quality.score += 15;
    } else {
      quality.issues.push('Отсутствует название книги');
    }
    
    if (result.author && result.author !== 'Неизвестный автор') {
      quality.score += 15;
    } else {
      quality.issues.push('Не определен автор');
    }
    
    if (result.description && result.description.length > 10) {
      quality.score += 10;
    }
    
    // Проверка содержимого
    const totalContent = result.chapters?.reduce((sum, ch) => sum + (ch.content?.length || 0), 0) || 0;
    if (totalContent > 1000) {
      quality.score += 25;
    } else {
      quality.issues.push('Слишком мало текстового содержимого');
    }
    
    // Проверка языка
    if (result.language && result.language !== 'unknown') {
      quality.score += 10;
    }
    
    // Расчет уверенности
    quality.confidence = Math.min(100, quality.score) / 100;
    
    // Общие рекомендации
    if (quality.score < 50) {
      quality.recommendations.push('Рассмотрите ручную обработку файла');
    } else if (quality.score < 75) {
      quality.recommendations.push('Проверьте и при необходимости отредактируйте результат');
    }
    
    return quality;
  }

  // Расширенная система определения языка
  static detectLanguageAdvanced(text) {
    if (!text || text.length < 100) return 'unknown';
    
    const sample = text.substring(0, 5000).toLowerCase();
    
    // Детекция различных языков
    const languagePatterns = {
      'ru': {
        chars: /[а-яё]/g,
        words: /\b(в|и|на|с|по|для|не|от|за|к|до|из|о|у|а|но|что|как|это|то|так|если|да|нет|или|еще|все|при|про|под|над|между|через|без|после|перед)\b/g,
        weight: 1.0
      },
      'en': {
        chars: /[a-z]/g,
        words: /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|up|about|into|through|during|before|after|above|below|over|under|a|an|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|can)\b/g,
        weight: 0.9
      },
      'de': {
        chars: /[a-zäöüß]/g,
        words: /\b(der|die|das|und|oder|aber|in|an|auf|zu|für|von|mit|bei|aus|über|unter|vor|nach|während|durch|ohne|gegen|um|bis|seit|wegen|trotz|statt|außer|ein|eine|ist|sind|war|waren|sein|haben|hat|hatte|werden|wird|wurde|kann|könnte|soll|sollte|muss|müssen|darf|dürfen)\b/g,
        weight: 0.8
      },
      'fr': {
        chars: /[a-zàâäèéêëîïôöùûüÿç]/g,
        words: /\b(le|la|les|de|du|des|et|ou|mais|dans|sur|avec|par|pour|sans|sous|vers|chez|entre|contre|pendant|avant|après|depuis|jusqu|alors|ainsi|aussi|encore|enfin|ensuite|puis|donc|car|parce|puisque|comme|si|quand|lorsque|où|que|qui|dont|lequel|laquelle|un|une|est|sont|était|étaient|être|avoir|a|avait|avaient|faire|fait|faisait|faisaient|aller|va|allait|allaient|venir|vient|venait|venaient|voir|voit|voyait|voyaient|savoir|sait|savait|savaient|pouvoir|peut|pouvait|pouvaient|vouloir|veut|voulait|voulaient|devoir|doit|devait|devaient)\b/g,
        weight: 0.8
      },
      'es': {
        chars: /[a-záéíóúñü]/g,
        words: /\b(el|la|los|las|de|del|y|o|pero|en|con|por|para|sin|sobre|bajo|hacia|desde|hasta|entre|contra|durante|antes|después|mientras|aunque|porque|como|si|cuando|donde|que|quien|cual|un|una|es|son|era|eran|ser|estar|está|están|estaba|estaban|tener|tiene|tenía|tenían|haber|hay|había|hacer|hace|hacía|hacían|ir|va|iba|iban|venir|viene|venía|venían|ver|ve|veía|veían|saber|sabe|sabía|sabían|poder|puede|podía|podían|querer|quiere|quería|querían|deber|debe|debía|debían)\b/g,
        weight: 0.8
      },
      'it': {
        chars: /[a-zàèìòù]/g,
        words: /\b(il|la|lo|gli|le|di|del|della|dello|degli|delle|e|o|ma|in|con|per|da|su|sotto|verso|fra|tra|contro|durante|prima|dopo|mentre|anche|ancora|così|quindi|però|se|quando|dove|che|chi|quale|un|una|è|sono|era|erano|essere|avere|ha|aveva|avevano|fare|fa|faceva|facevano|andare|va|andava|andavano|venire|viene|veniva|venivano|vedere|vede|vedeva|vedevano|sapere|sa|sapeva|sapevano|potere|può|poteva|potevano|volere|vuole|voleva|volevano|dovere|deve|doveva|dovevano)\b/g,
        weight: 0.8
      },
      'pt': {
        chars: /[a-záàâãçéêíóôõú]/g,
        words: /\b(o|a|os|as|de|do|da|dos|das|e|ou|mas|em|com|por|para|sem|sobre|sob|até|desde|entre|contra|durante|antes|depois|enquanto|embora|porque|como|se|quando|onde|que|quem|qual|um|uma|é|são|era|eram|ser|estar|está|estão|estava|estavam|ter|tem|tinha|tinham|haver|há|havia|fazer|faz|fazia|faziam|ir|vai|ia|iam|vir|vem|vinha|vinham|ver|vê|via|viam|saber|sabe|sabia|sabiam|poder|pode|podia|podiam|querer|quer|queria|queriam|dever|deve|devia|deviam)\b/g,
        weight: 0.8
      }
    };
    
    const scores = {};
    
    Object.entries(languagePatterns).forEach(([lang, pattern]) => {
      const charMatches = (sample.match(pattern.chars) || []).length;
      const wordMatches = (sample.match(pattern.words) || []).length;
      
      const charRatio = charMatches / sample.length;
      const wordScore = wordMatches * pattern.weight;
      
      scores[lang] = charRatio * 0.6 + (wordScore / 100) * 0.4;
    });
    
    // Определяем язык с наибольшим счетом
    const sortedLangs = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedLangs.length > 0 && sortedLangs[0][1] > 0.1) {
      const [topLang, topScore] = sortedLangs[0];
      const [secondLang, secondScore] = sortedLangs[1] || [null, 0];
      
      // Если второй язык очень близок, возвращаем смешанный
      if (secondScore > 0 && (topScore - secondScore) < 0.05) {
        return `${topLang}+${secondLang}`;
      }
      
      return topLang;
    }
    
    return 'unknown';
  }

  // Вспомогательные методы
  static extractFB2Text(element, tagName) {
    const el = element?.querySelector(tagName);
    return el?.textContent?.trim() || '';
  }

  static extractSectionTitle(section) {
    const titleEl = section.querySelector('title');
    if (titleEl) {
      return Array.from(titleEl.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(Boolean)
        .join(' ');
    }
    return '';
  }

  static extractSectionContent(section) {
    const paragraphs = section.querySelectorAll('p');
    return Array.from(paragraphs)
      .map(p => p.textContent?.trim())
      .filter(text => text && text.length > 5)
      .join('\n\n');
  }

  static calculateTextQuality(text) {
    if (!text || text.length < 100) return 0;
    
    // Подсчитываем читаемые символы
    const readableChars = text.match(/[a-zA-Zа-яёА-ЯЁ0-9\s.,!?;:'"()\-]/g) || [];
    const readableRatio = readableChars.length / text.length;
    
    // Проверяем наличие русских букв
    const russianChars = text.match(/[а-яёА-ЯЁ]/g) || [];
    const russianRatio = russianChars.length / text.length;
    
    // Проверяем наличие английских букв
    const englishChars = text.match(/[a-zA-Z]/g) || [];
    const englishRatio = englishChars.length / text.length;
    
    // Общий скор качества
    let score = readableRatio * 0.7;
    
    // Бонус за наличие букв
    if (russianRatio > 0.1) score += 0.2;
    if (englishRatio > 0.1) score += 0.1;
    
    // Штраф за слишком много символов подряд
    if (text.match(/(.)\1{10,}/)) score -= 0.3;
    
    return score;
  }

  static intelligentChapterSplit(text) {
    const chapters = [];
    
    // Различные паттерны для определения глав
    const chapterPatterns = [
      // Русские паттерны
      /^(ГЛАВА|Глава|глава)\s*(\d+|[IVXLCDM]+)/gm,
      /^(ЧАСТЬ|Часть|часть)\s*(\d+|[IVXLCDM]+)/gm,
      /^(РАЗДЕЛ|Раздел|раздел)\s*(\d+|[IVXLCDM]+)/gm,
      /^(КНИГА|Книга|книга)\s*(\d+|[IVXLCDM]+)/gm,
      /^(\d+)\.\s*([А-ЯЁ])/gm,
      
      // Английские паттерны
      /^(CHAPTER|Chapter|chapter)\s*(\d+|[IVXLCDM]+)/gm,
      /^(PART|Part|part)\s*(\d+|[IVXLCDM]+)/gm,
      /^(SECTION|Section|section)\s*(\d+|[IVXLCDM]+)/gm,
      
      // Центрированные заголовки
      /^\s*\*\s*(\d+|[IVXLCDM]+)\s*\*\s*$/gm,
      /^\s*-+\s*(\d+|[IVXLCDM]+)\s*-+\s*$/gm,
      
      // Пронумерованные разделы
      /^\d+\.\s*$/gm
    ];
    
    let bestSplit = null;
    let maxChapters = 0;
    
    // Ищем лучший паттерн для разбиения
    for (const pattern of chapterPatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > maxChapters && matches.length > 1) {
        maxChapters = matches.length;
        bestSplit = matches;
      }
    }
    
    if (bestSplit && bestSplit.length > 1) {
      // Разбиваем по найденным заголовкам
      for (let i = 0; i < bestSplit.length; i++) {
        const start = bestSplit[i].index;
        const end = i + 1 < bestSplit.length ? bestSplit[i + 1].index : text.length;
        const chapterText = text.slice(start, end).trim();
        
        if (chapterText.length > 100) {
          const lines = chapterText.split('\n');
          const title = lines[0].trim() || `Глава ${i + 1}`;
          const content = lines.slice(1).join('\n').trim();
          
          chapters.push({
            title: this.cleanText(title),
            content: this.cleanText(content || chapterText),
            index: i
          });
        }
      }
    }
    
    // Если не нашли главы, разбиваем по размеру с умным разбиением
    if (chapters.length === 0) {
      const words = text.split(/\s+/);
      const wordsPerChapter = Math.max(1000, Math.floor(words.length / 20)); // Не более 20 глав
      
      let currentChapter = [];
      let chapterIndex = 0;
      
      for (let i = 0; i < words.length; i++) {
        currentChapter.push(words[i]);
        
        if (currentChapter.length >= wordsPerChapter) {
          // Ищем ближайший конец предложения
          for (let j = i; j < Math.min(i + 50, words.length); j++) {
            if (words[j].match(/[.!?]$/)) {
              i = j;
              break;
            }
          }
          
          const chapterText = currentChapter.join(' ').trim();
          if (chapterText.length > 100) {
            chapters.push({
              title: `Часть ${chapterIndex + 1}`,
              content: this.cleanText(chapterText),
              index: chapterIndex
            });
            chapterIndex++;
          }
          
          currentChapter = [];
        }
      }
      
      // Добавляем остаток
      if (currentChapter.length > 0) {
        const chapterText = currentChapter.join(' ').trim();
        if (chapterText.length > 100) {
          chapters.push({
            title: `Часть ${chapterIndex + 1}`,
            content: this.cleanText(chapterText),
            index: chapterIndex
          });
        }
      }
    }
    
    return chapters.length > 0 ? chapters : [{
      title: 'Основной текст',
      content: this.cleanText(text),
      index: 0
    }];
  }

  static processTextContent(text, fileName) {
    const cleanedText = this.cleanText(text);
    const title = fileName.replace(/\.[^/.]+$/, "");
    
    const chapters = this.intelligentChapterSplit(cleanedText);
    
    return {
      title,
      author: 'Неизвестный автор',
      description: '',
      chapters,
      language: this.detectLanguage(cleanedText),
      wordCount: this.countWords(cleanedText),
      estimatedReadingTime: this.estimateReadingTime(cleanedText)
    };
  }

  static extractHTMLFromEPUB(text) {
    // Извлекаем HTML контент из EPUB
    const htmlMatches = text.match(/<html[^>]*>[\s\S]*?<\/html>/gi) || [];
    return htmlMatches.join('\n');
  }

  static splitHTMLIntoChapters(html, bookTitle) {
    // Удаляем HTML теги и извлекаем текст
    const textContent = html.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return this.intelligentChapterSplit(textContent);
  }

  static cleanText(text) {
    if (!text) return '';
    
    // Удаление HTML/XML тегов
    text = text.replace(/<[^>]*>/g, ' ');
    
    // Декодирование HTML entities
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&apos;': "'",
      '&nbsp;': ' ',
      '&mdash;': '—',
      '&ndash;': '–',
      '&hellip;': '…',
      '&laquo;': '«',
      '&raquo;': '»',
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™'
    };
    
    Object.entries(entities).forEach(([entity, char]) => {
      text = text.replace(new RegExp(entity, 'g'), char);
    });
    
    // Удаление служебных символов
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Нормализация пробелов и переносов
    text = text.replace(/\r\n/g, '\n');
    text = text.replace(/\r/g, '\n');
    text = text.replace(/[ \t]+/g, ' ');
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // Очистка границ
    text = text.trim();
    
    return text;
  }

  static extractTextFromXML(xml) {
    xml = xml.replace(/<\?xml[^>]*\?>/g, '');
    xml = xml.replace(/<!--[\s\S]*?-->/g, '');
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    
    return doc.textContent || xml.replace(/<[^>]*>/g, ' ');
  }

  static detectLanguage(text) {
    if (!text) return 'unknown';
    
    const russianChars = (text.match(/[а-яёА-ЯЁ]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const totalChars = russianChars + englishChars;
    
    if (totalChars === 0) return 'unknown';
    
    const russianRatio = russianChars / totalChars;
    const englishRatio = englishChars / totalChars;
    
    if (russianRatio > 0.5) return 'ru';
    if (englishRatio > 0.5) return 'en';
    
    return 'mixed';
  }

  static countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  static estimateReadingTime(text) {
    const words = this.countWords(text);
    const wordsPerMinute = 200; // Средняя скорость чтения
    const minutes = Math.ceil(words / wordsPerMinute);
    
    if (minutes < 60) {
      return `${minutes} мин`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} ч${remainingMinutes > 0 ? ` ${remainingMinutes} мин` : ''}`;
    }
  }
}

// Профессиональная система экспорта/импорта библиотеки
class LibraryManager {
  static async exportLibrary(books, readingStats, bookmarks, achievements, userSettings = {}) {
    try {
      const exportData = {
        version: '2.0.0',
        exportDate: new Date().toISOString(),
        metadata: {
          totalBooks: books.length,
          totalBookmarks: Object.values(bookmarks).flat().length,
          achievementsCount: Object.values(achievements).filter(Boolean).length,
          exportedBy: 'BookReader Pro'
        },
        library: {
          books: books.map(book => ({
            ...book,
            // Сериализуем все данные книги
            exportedAt: new Date().toISOString()
          })),
          readingStats,
          bookmarks,
          achievements,
          userSettings: {
            darkMode: userSettings.darkMode,
            ttsSettings: userSettings.ttsSettings,
            lastExport: new Date().toISOString(),
            ...userSettings
          }
        }
      };

      // Создаем blob с данными с правильной UTF-8 кодировкой
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob(['\uFEFF' + jsonString], { type: 'application/json;charset=utf-8' });
      
      // Создаем ссылку для скачивания
      const url = URL.createObjectURL(blob);
      const fileName = `library_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      // Скачиваем файл
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return {
        success: true,
        fileName,
        size: blob.size,
        booksCount: books.length,
        bookmarksCount: Object.values(bookmarks).flat().length
      };
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      throw new Error(`Ошибка экспорта библиотеки: ${error.message}`);
    }
  }

  static async importLibrary(file, onProgress) {
    try {
      onProgress?.({ status: 'reading', progress: 10, message: 'Читаю файл библиотеки...' });
      
      // Читаем файл с правильной обработкой кодировки
      const arrayBuffer = await file.arrayBuffer();
      let text = '';
      
      // Пробуем несколько способов декодирования
      try {
        // Сначала пробуем UTF-8
        const decoder = new TextDecoder('utf-8', { fatal: true });
        text = decoder.decode(arrayBuffer);
      } catch (e) {
        // Если не получилось, пробуем Windows-1251
        try {
          const decoder = new TextDecoder('windows-1251');
          text = decoder.decode(arrayBuffer);
        } catch (e2) {
          // Последняя попытка - ISO-8859-1
          const decoder = new TextDecoder('iso-8859-1');
          text = decoder.decode(arrayBuffer);
        }
      }
      
      // Удаляем BOM если он есть
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      
      const importData = JSON.parse(text);
      
      onProgress?.({ status: 'validating', progress: 25, message: 'Проверяю структуру данных...' });
      
      // Валидация структуры
      this.validateImportData(importData);
      
      onProgress?.({ status: 'processing', progress: 50, message: 'Обрабатываю данные библиотеки...' });
      
      // Извлекаем данные
      const { books, readingStats, bookmarks, achievements, userSettings } = importData.library;
      
      // Обрабатываем и нормализуем данные
      const processedBooks = await this.processImportedBooks(books, onProgress);
      const processedStats = this.processImportedStats(readingStats);
      const processedBookmarks = this.processImportedBookmarks(bookmarks);
      const processedAchievements = this.processImportedAchievements(achievements);
      const processedSettings = this.processImportedSettings(userSettings);
      
      onProgress?.({ status: 'completed', progress: 100, message: 'Импорт завершен успешно!' });
      
      return {
        success: true,
        data: {
          books: processedBooks,
          readingStats: processedStats,
          bookmarks: processedBookmarks,
          achievements: processedAchievements,
          userSettings: processedSettings
        },
        metadata: importData.metadata,
        importStats: {
          booksImported: processedBooks.length,
          bookmarksImported: Object.values(processedBookmarks).flat().length,
          achievementsImported: Object.values(processedAchievements).filter(Boolean).length,
          originalDate: importData.exportDate,
          version: importData.version
        }
      };
    } catch (error) {
      console.error('Ошибка импорта:', error);
      throw new Error(`Ошибка импорта библиотеки: ${error.message}`);
    }
  }

  static validateImportData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Неверная структура файла');
    }
    
    if (!data.version) {
      throw new Error('Отсутствует версия файла экспорта');
    }
    
    if (!data.library) {
      throw new Error('Отсутствуют данные библиотеки');
    }
    
    if (!Array.isArray(data.library.books)) {
      throw new Error('Неверная структура данных книг');
    }
    
    // Проверка совместимости версий
    const supportedVersions = ['1.0.0', '2.0.0'];
    if (!supportedVersions.includes(data.version)) {
      console.warn(`Версия ${data.version} может быть не полностью совместима`);
    }
  }

  static async processImportedBooks(books, onProgress) {
    const processedBooks = [];
    
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      
      // Исправляем кодировку в названиях
      const fixedTitle = this.fixEncoding(book.title);
      const fixedAuthor = this.fixEncoding(book.author);
      const fixedDescription = this.fixEncoding(book.description || '');
      
      onProgress?.({ 
        status: 'processing', 
        progress: 50 + (i / books.length) * 30, 
        message: `Обрабатываю книгу: ${fixedTitle}...` 
      });
      
      // Генерируем новый ID если нужно
      const processedBook = {
        ...book,
        id: book.id || `imported_book_${Date.now()}_${i}`,
        title: fixedTitle,
        author: fixedAuthor,
        description: fixedDescription,
        addedDate: book.addedDate || new Date().toISOString(),
        imported: true,
        importedAt: new Date().toISOString()
      };
      
      // Проверяем и нормализуем главы
      if (processedBook.chapters) {
        processedBook.chapters = processedBook.chapters.map((chapter, chIndex) => ({
          ...chapter,
          title: this.fixEncoding(chapter.title || `Глава ${chIndex + 1}`),
          content: chapter.content ? this.fixEncoding(chapter.content) : chapter.content,
          index: chIndex
        }));
      }
      
      // Проверяем обложку
      if (!processedBook.cover || processedBook.cover === '') {
        processedBook.cover = `keys/book-cover-${encodeURIComponent(processedBook.title)}?prompt=${encodeURIComponent(processedBook.title + ' book cover classic literature')}`;
      }
      
      processedBooks.push(processedBook);
    }
    
    return processedBooks;
  }

  // Функция для исправления кодировки
  static fixEncoding(text) {
    if (!text || typeof text !== 'string') return text;
    
    // Проверяем, есть ли проблемы с кодировкой
    const hasEncodingIssues = text.includes('Р') && text.includes('С');
    
    if (!hasEncodingIssues) return text;
    
    try {
      // Попытка исправить двойное кодирование UTF-8
      const bytes = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) {
        bytes[i] = text.charCodeAt(i) & 0xFF;
      }
      
      const decoder = new TextDecoder('utf-8');
      const fixed = decoder.decode(bytes);
      
      // Проверяем, стал ли текст лучше
      if (fixed.length > 0 && !fixed.includes('Р')) {
        return fixed;
      }
    } catch (e) {
      // Если не получилось, возвращаем оригинал
    }
    
    // Безопасная замена распространенных искажений кодировки
    let fixedText = text;
    
    // Используем hex-коды для безопасности
    const replacements = [
      ['\u0420\u0432\u0420\u043e\u0421\u0402\u0420\u043e\u0420\u045a\u0420\u043e\u0420\u0412', 'Воронов'],
      ['\u0420\u0459\u0420\u043e\u0421\u0402\u0420\u043e\u0420\u0459\u0421\u040a', 'Король'],
      ['\u0420\u045a\u0420\u043e\u0421\u0402\u0420\u0430', 'Нора'],
      ['\u0420\u0404\u0420\u0430\u0420\u045a\u0420\u0430\u0420\u0412\u0420\u0451\u0421\u040a', 'Сакавич'],
      ['\u0420\u045c\u0420\u043e\u0420\u0459\u0420\u045a\u0420\u0451\u0420\u045a', 'Толкин'],
      ['\u0420\u2013\u0420\u043e\u0421\u0403\u0421\u201a\u0420\u043e\u0420\u0415\u0420\u0412\u0421\u0403\u0420\u045a\u0420\u0451\u0420\u0419', 'Достоевский'],
      ['\u0420\u041f\u0421\u0453\u0421\u02c6\u0420\u045a\u0420\u0451\u0420\u045a', 'Пушкин'],
      ['\u0420\u00a7\u0420\u0415\u0421\u2026\u0420\u043e\u0420\u0412', 'Чехов']
    ];
    
    for (const [corrupted, correct] of replacements) {
      try {
        if (fixedText.includes(corrupted)) {
          fixedText = fixedText.split(corrupted).join(correct);
        }
      } catch (e) {
        // Игнорируем ошибки замены
        continue;
      }
    }
    
    // Дополнительная очистка общих паттернов
    try {
      fixedText = fixedText
        .replace(/Р[^\u0400-\u04FF]/g, 'Р')
        .replace(/С[^\u0400-\u04FF]/g, 'С')
        .trim();
    } catch (e) {
      // Если очистка не удалась, возвращаем текущий результат
    }
    
    return fixedText;
  }

  static processImportedStats(stats) {
    if (!stats || typeof stats !== 'object') {
      return {};
    }
    
    // Нормализуем статистику
    const processedStats = {};
    
    Object.entries(stats).forEach(([bookId, stat]) => {
      processedStats[bookId] = {
        progress: Math.max(0, Math.min(100, stat.progress || 0)),
        lastRead: stat.lastRead || Date.now(),
        readingTime: stat.readingTime || 0,
        bookmarkAdded: stat.bookmarkAdded || false,
        added: stat.added || false,
        ...stat
      };
    });
    
    return processedStats;
  }

  static processImportedBookmarks(bookmarks) {
    if (!bookmarks || typeof bookmarks !== 'object') {
      return {};
    }
    
    const processedBookmarks = {};
    
    Object.entries(bookmarks).forEach(([bookId, bookmarkList]) => {
      if (Array.isArray(bookmarkList)) {
        processedBookmarks[bookId] = bookmarkList.map(bookmark => ({
          ...bookmark,
          id: bookmark.id || `imported_bookmark_${Date.now()}_${Math.random()}`,
          timestamp: bookmark.timestamp || Date.now()
        }));
      }
    });
    
    return processedBookmarks;
  }

  static processImportedAchievements(achievements) {
    if (!achievements || typeof achievements !== 'object') {
      return {};
    }
    
    // Возвращаем достижения как есть, но проверяем структуру
    const validAchievements = {};
    const knownAchievements = ['collector', 'reader', 'bookmarker', 'active', 'wordMaster', 'consistent'];
    
    knownAchievements.forEach(key => {
      validAchievements[key] = Boolean(achievements[key]);
    });
    
    return validAchievements;
  }

  static processImportedSettings(settings) {
    if (!settings || typeof settings !== 'object') {
      return {};
    }
    
    return {
      darkMode: Boolean(settings.darkMode),
      ttsSettings: settings.ttsSettings || {
        voice: '',
        rate: 1,
        pitch: 1,
        volume: 1
      },
      importedAt: new Date().toISOString(),
      ...settings
    };
  }

  static async mergeWithExistingLibrary(existingBooks, importedBooks, strategy = 'merge') {
    switch (strategy) {
      case 'replace':
        // Полная замена
        return importedBooks;
        
      case 'merge':
        // Слияние без дубликатов
        const existingTitles = new Set(existingBooks.map(book => 
          `${book.title.toLowerCase()}_${book.author.toLowerCase()}`
        ));
        
        const newBooks = importedBooks.filter(book => 
          !existingTitles.has(`${book.title.toLowerCase()}_${book.author.toLowerCase()}`)
        );
        
        return [...existingBooks, ...newBooks];
        
      case 'keep-existing':
        // Добавляем только новые, оставляем существующие без изменений
        return existingBooks;
        
      default:
        return [...existingBooks, ...importedBooks];
    }
  }

  static generateBackupInfo(books, readingStats, bookmarks) {
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
    const textBooks = books.filter(b => b.type === 'text').length;
    const audioBooks = books.filter(b => b.type === 'audio').length;
    const completedBooks = books.filter(book => {
      const progress = readingStats[book.id]?.progress || 0;
      return progress >= 100;
    }).length;
    
    return {
      summary: `📚 ${books.length} книг (📖 ${textBooks} текстовых, 🎧 ${audioBooks} аудио)`,
      details: [
        `📊 Прогресс: ${completedBooks} завершено`,
        `🔖 Закладок: ${Object.values(bookmarks).flat().length}`,
        `📝 Всего слов: ${totalWords.toLocaleString()}`,
        `📅 Создан: ${new Date().toLocaleDateString()}`
      ],
      totalWords,
      totalBooks: books.length,
      totalBookmarks: Object.values(bookmarks).flat().length,
      completedBooks
    };
  }
}

// Система загрузки аудиокниг
class AudioBookLoader {
  static async loadFromURL(url, title = '', chapter = 1) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('audio/')) {
        throw new Error('URL не содержит аудио файл');
      }
      
      const contentLength = response.headers.get('content-length');
      const size = contentLength ? parseInt(contentLength) : 0;
      
      return {
        url,
        title: title || `Глава ${chapter}`,
        duration: 0,
        size,
        type: 'url'
      };
    } catch (error) {
      throw new Error(`Ошибка загрузки ${url}: ${error.message}`);
    }
  }

  static async loadMultipleFromURLs(urls, onProgress) {
    const chapters = [];
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim();
      if (!url) continue;
      
      try {
        onProgress?.({ 
          current: i + 1, 
          total: urls.length, 
          url,
          status: 'loading'
        });
        
        const chapter = await this.loadFromURL(url, '', i + 1);
        chapters.push(chapter);
        
        onProgress?.({ 
          current: i + 1, 
          total: urls.length, 
          url,
          status: 'success'
        });
      } catch (error) {
        onProgress?.({ 
          current: i + 1, 
          total: urls.length, 
          url,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return chapters;
  }

  static async createAudioBook(chapters, title, author) {
    return {
      id: `audiobook_${Date.now()}`,
      title: title || `Аудиокнига ${chapters.length} глав`,
      author: author || 'Неизвестный автор',
      type: 'audio',
      chapters,
      addedDate: new Date().toISOString(),
      progress: 0,
      currentChapter: 0,
      cover: "assets/audiobook-cover.png?prompt=audiobook%20headphones%20sound%20waves%20modern%20design",
      totalDuration: 0,
      totalSize: chapters.reduce((sum, ch) => sum + (ch.size || 0), 0)
    };
  }
}

// Продвинутая система TTS
class TTSManager {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentUtterance = null;
    this.isPlaying = false;
    this.currentSentence = 0;
    this.sentences = [];
    this.callbacks = {};
    this.queue = [];
    this.currentSpeed = 1;
    this.currentPitch = 1;
    this.currentVolume = 1;
  }

  async initVoices() {
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synth.getVoices();
        if (this.voices.length > 0) {
          resolve(this.voices);
        }
      };

      if (this.voices.length === 0) {
        this.synth.addEventListener('voiceschanged', loadVoices);
        loadVoices();
      } else {
        resolve(this.voices);
      }
    });
  }

  getVoicesByLanguage(lang = 'ru') {
    return this.voices.filter(voice => 
      voice.lang.startsWith(lang) || 
      voice.name.toLowerCase().includes('russian') ||
      voice.name.toLowerCase().includes('rus') ||
      voice.name.toLowerCase().includes('maria') ||
      voice.name.toLowerCase().includes('yuri')
    );
  }

  splitIntoSentences(text) {
    // Улучшенное разбиение на предложения
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [];
    return sentences
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => {
        // Ограничиваем длину предложения для лучшего произношения
        if (s.length > 200) {
          const parts = s.split(/[,;:]/);
          return parts.filter(p => p.trim().length > 0);
        }
        return [s];
      })
      .flat();
  }

  speak(text, options = {}) {
    this.stop();
    
    this.sentences = this.splitIntoSentences(text);
    this.currentSentence = 0;
    this.currentSpeed = options.rate || 1;
    this.currentPitch = options.pitch || 1;
    this.currentVolume = options.volume || 1;
    
    this.speakSentence(options);
  }

  speakSentence(options = {}) {
    if (this.currentSentence >= this.sentences.length) {
      this.isPlaying = false;
      this.callbacks.onEnd?.();
      return;
    }

    const sentence = this.sentences[this.currentSentence];
    this.currentUtterance = new SpeechSynthesisUtterance(sentence);
    
    // Настройки голоса
    const voice = this.voices.find(v => v.name === options.voice) || 
                  this.getVoicesByLanguage('ru')[0] || 
                  this.voices[0];
    
    if (voice) this.currentUtterance.voice = voice;
    this.currentUtterance.rate = this.currentSpeed;
    this.currentUtterance.pitch = this.currentPitch;
    this.currentUtterance.volume = this.currentVolume;

    this.currentUtterance.onstart = () => {
      this.isPlaying = true;
      this.callbacks.onSentenceStart?.(this.currentSentence, sentence);
    };

    this.currentUtterance.onend = () => {
      this.currentSentence++;
      this.callbacks.onSentenceEnd?.(this.currentSentence - 1);
      
      if (this.isPlaying) {
        setTimeout(() => this.speakSentence(options), 100);
      }
    };

    this.currentUtterance.onerror = (event) => {
      console.error('TTS Error:', event.error);
      this.currentSentence++;
      if (this.isPlaying && this.currentSentence < this.sentences.length) {
        setTimeout(() => this.speakSentence(options), 100);
      }
    };

    this.synth.speak(this.currentUtterance);
  }

  pause() {
    this.synth.pause();
    this.isPlaying = false;
  }

  resume() {
    this.synth.resume();
    this.isPlaying = true;
  }

  stop() {
    this.synth.cancel();
    this.isPlaying = false;
    this.currentSentence = 0;
    this.currentUtterance = null;
  }

  setSpeed(speed) {
    this.currentSpeed = speed;
    if (this.currentUtterance) {
      this.currentUtterance.rate = speed;
    }
  }

  setPitch(pitch) {
    this.currentPitch = pitch;
    if (this.currentUtterance) {
      this.currentUtterance.pitch = pitch;
    }
  }

  setVolume(volume) {
    this.currentVolume = volume;
    if (this.currentUtterance) {
      this.currentUtterance.volume = volume;
    }
  }

  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }

  getProgress() {
    return {
      currentSentence: this.currentSentence,
      totalSentences: this.sentences.length,
      isPlaying: this.isPlaying,
      currentText: this.sentences[this.currentSentence] || ''
    };
  }
}

// ИИ Помощник
class AIAssistant {
  constructor() {
    this.learningData = JSON.parse(localStorage.getItem('aiLearningData') || '[]');
    this.conversationHistory = [];
    this.bookAnalysisCache = new Map();
    // API ключ должен быть установлен через переменные окружения или пользовательские настройки
    this.apiKey = localStorage.getItem('openrouter_api_key') || '';
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = 'qwen/qwq-32b:free';
  }

  async callOpenRouterAPI(messages) {
    // Проверяем наличие API ключа
    if (!this.apiKey) {
      throw new Error('API ключ не установлен. Пожалуйста, установите OPENROUTER_API_KEY в переменных окружения или в настройках приложения.');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": "https://liquidglasslibrary.com",
          "X-Title": "Liquid Glass Library Pro",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  }

  async searchInternet(query) {
    // Реальный поиск через ИИ
    try {
      const messages = [
        {
          role: "system",
          content: "Ты - помощник по поиску информации. Предоставь краткую и точную информацию по запросу пользователя. Отвечай на русском языке."
        },
        {
          role: "user",
          content: `Найди информацию о: ${query}`
        }
      ];

      const result = await this.callOpenRouterAPI(messages);
      
      // Очищаем результат от служебных тегов
      const cleanedResult = result
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Удаляем теги <think>
        .replace(/<thinking>[\s\S]*?<\/thinking>/g, '') // Удаляем теги <thinking>
        .replace(/^\s+|\s+$/g, '') // Убираем лишние пробелы
        .trim();

      return [{
        title: `Информация о "${query}"`,
        snippet: cleanedResult,
        url: `https://search.example.com/q=${encodeURIComponent(query)}`,
        relevance: 0.9
      }];
    } catch (error) {
      console.error('Search error:', error);
      return [{
        title: `Результат поиска для "${query}"`,
        snippet: `Извините, не удалось получить информацию из интернета. Попробуйте переформулировать запрос.`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        relevance: 0.5
      }];
    }
  }

  async analyzeBook(bookContent, question) {
    // Кешируем анализ книг для ускорения
    const cacheKey = `${bookContent.substring(0, 100)}_${question}`;
    
    if (this.bookAnalysisCache.has(cacheKey)) {
      return this.bookAnalysisCache.get(cacheKey);
    }
    
    try {
      // Если контент слишком большой, используем локальный анализ
      if (bookContent.length > 10000) {
        const words = bookContent.toLowerCase().split(/\s+/);
        const questionWords = question.toLowerCase().split(/\s+/)
          .filter(word => word.length > 2)
          .filter(word => !['что', 'как', 'где', 'когда', 'почему', 'зачем', 'кто'].includes(word));
        
        // Улучшенный поиск релевантных отрывков
        const sentences = bookContent.split(/[.!?]+/);
        const relevantSentences = [];
        
        sentences.forEach(sentence => {
          const sentenceLower = sentence.toLowerCase();
          let score = 0;
          
          questionWords.forEach(word => {
            const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = (sentenceLower.match(wordRegex) || []).length;
            score += matches;
          });
          
          // Бонус за контекст
          if (sentence.length > 50 && sentence.length < 300) {
            score += 0.5;
          }
          
          if (score > 0) {
            relevantSentences.push({ sentence: sentence.trim(), score });
          }
        });
        
        const result = relevantSentences
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(r => r.sentence)
          .join('\n\n');
        
        this.bookAnalysisCache.set(cacheKey, result);
        return result;
      }
      
      // Используем ИИ для анализа небольших текстов
      const messages = [
        {
          role: "system",
          content: "Ты - литературный аналитик. Проанализируй текст и ответь на вопрос пользователя, основываясь на содержании. Отвечай кратко и по существу."
        },
        {
          role: "user",
          content: `Текст: ${bookContent.substring(0, 8000)}...\n\nВопрос: ${question}`
        }
      ];

      const result = await this.callOpenRouterAPI(messages);
      
      // Очищаем результат от служебных тегов
      const cleanedResult = result
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Удаляем теги <think>
        .replace(/<thinking>[\s\S]*?<\/thinking>/g, '') // Удаляем теги <thinking>
        .replace(/^\s+|\s+$/g, '') // Убираем лишние пробелы
        .trim();
      
      this.bookAnalysisCache.set(cacheKey, cleanedResult);
      return cleanedResult;
      
    } catch (error) {
      console.error('Book analysis error:', error);
      
      // Fallback к локальному анализу
      const words = bookContent.toLowerCase().split(/\s+/);
      const questionWords = question.toLowerCase().split(/\s+/)
        .filter(word => word.length > 2)
        .filter(word => !['что', 'как', 'где', 'когда', 'почему', 'зачем', 'кто'].includes(word));
      
      const sentences = bookContent.split(/[.!?]+/);
      const relevantSentences = [];
      
      sentences.forEach(sentence => {
        const sentenceLower = sentence.toLowerCase();
        let score = 0;
        
        questionWords.forEach(word => {
          const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
          const matches = (sentenceLower.match(wordRegex) || []).length;
          score += matches;
        });
        
        if (sentence.length > 50 && sentence.length < 300) {
          score += 0.5;
        }
        
        if (score > 0) {
          relevantSentences.push({ sentence: sentence.trim(), score });
        }
      });
      
      const result = relevantSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(r => r.sentence)
        .join('\n\n');
      
      this.bookAnalysisCache.set(cacheKey, result);
      return result;
    }
  }

  async generateSummary(bookContent, maxLength = 300) {
    const sentences = bookContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length <= 3) {
      return bookContent.substring(0, maxLength);
    }
    
    // Берем начало, середину и конец
    const beginning = sentences.slice(0, 2).join('. ');
    const middle = sentences.slice(Math.floor(sentences.length / 2), Math.floor(sentences.length / 2) + 1).join('. ');
    const end = sentences.slice(-2).join('. ');
    
    const summary = `${beginning}. ${middle}. ${end}.`;
    
    return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
  }

  async analyzeReadingPattern(books, readingStats) {
    const patterns = {
      favoriteGenres: {},
      readingSpeed: 0,
      preferredLength: 'medium',
      readingTimes: {},
      completionRate: 0
    };
    
    books.forEach(book => {
      const stats = readingStats[book.id] || {};
      
      // Анализ жанров (если доступно)
      if (book.genres) {
        book.genres.forEach(genre => {
          patterns.favoriteGenres[genre] = (patterns.favoriteGenres[genre] || 0) + 1;
        });
      }
      
      // Анализ времени чтения
      if (stats.lastRead) {
        const hour = new Date(stats.lastRead).getHours();
        patterns.readingTimes[hour] = (patterns.readingTimes[hour] || 0) + 1;
      }
      
      // Анализ скорости чтения
      if (stats.readingTime && book.wordCount) {
        const wordsPerMinute = book.wordCount / (stats.readingTime / 60000);
        patterns.readingSpeed = Math.max(patterns.readingSpeed, wordsPerMinute);
      }
    });
    
    return patterns;
  }

  learnFromInteraction(question, answer, context = null) {
    const learningEntry = {
      timestamp: Date.now(),
      question,
      answer,
      context,
      keywords: this.extractKeywords(question + ' ' + answer),
      satisfaction: null // Может быть установлен пользователем
    };
    
    this.learningData.push(learningEntry);
    
    // Ограничиваем размер данных обучения
    if (this.learningData.length > 1000) {
      this.learningData = this.learningData.slice(-800);
    }
    
    localStorage.setItem('aiLearningData', JSON.stringify(this.learningData));
  }

  extractKeywords(text) {
    const stopWords = new Set([
      'и', 'в', 'на', 'с', 'по', 'для', 'не', 'от', 'за', 'к', 'до', 'из', 'о', 'об', 'у', 'а', 'но', 'что', 'как', 'это', 'то', 'так', 'бы', 'же', 'ли', 'уже', 'если', 'да', 'нет', 'или', 'еще', 'все', 'вся', 'весь', 'при', 'про', 'под', 'над', 'между', 'через', 'без', 'кроме', 'после', 'перед', 'во', 'со', 'ко', 'ро', 'ан', 'ив', 'ль', 'ны', 'оч', 'ом', 'ту', 'ке', 'ай', 'ий', 'ой', 'ый', 'ей', 'ём', 'ом', 'ам', 'ми', 'ых', 'их', 'ие', 'ые', 'ое', 'ая', 'ая', 'ую', 'ой', 'ей', 'ой', 'ую', 'ая', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой', 'ей', 'ой', 'ую', 'ой',
      'and', 'or', 'but', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for', 'on', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
    ]);
    
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
    
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  findSimilarQuestions(question) {
    const questionKeywords = this.extractKeywords(question);
    
    return this.learningData
      .map(entry => ({
        ...entry,
        similarity: entry.keywords.filter(k => questionKeywords.includes(k)).length
      }))
      .filter(entry => entry.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  }

  async generateResponse(question, userBooks = []) {
    try {
      // Проверяем обученные данные
      const similarQuestions = this.findSimilarQuestions(question);
      
      if (similarQuestions.length > 0) {
        const best = similarQuestions[0];
        return {
          text: `На основе моего опыта: ${best.answer}`,
          source: 'learning',
          confidence: best.similarity / 10,
          relatedQuestions: similarQuestions.slice(1, 3).map(q => q.question)
        };
      }
      
      // Анализ запросов по типу
      const questionLower = question.toLowerCase();
      
      // Запросы о книгах
      if (questionLower.includes('книг') || questionLower.includes('текст') || questionLower.includes('содержание')) {
        for (const book of userBooks) {
          if (book.chapters && book.chapters.length > 0) {
            const bookContent = book.chapters.map(ch => ch.content).join('\n');
            const analysis = await this.analyzeBook(bookContent, question);
            
            if (analysis && analysis.length > 50) {
              const summary = await this.generateSummary(analysis);
              return {
                text: `Найдено в книге "${book.title}":\n\n${summary}`,
                source: 'book',
                bookTitle: book.title,
                fullAnalysis: analysis
              };
            }
          }
        }
      }
      
      // Запросы о статистике
      if (questionLower.includes('статистик') || questionLower.includes('прогресс') || questionLower.includes('сколько')) {
        const stats = this.analyzeLibraryStats(userBooks);
        return {
          text: `Статистика вашей библиотеки:\n\n${stats}`,
          source: 'analysis'
        };
      }
      
      // Рекомендации
      if (questionLower.includes('рекоменд') || questionLower.includes('советуй') || questionLower.includes('что читать')) {
        const recommendations = this.generateBookRecommendations(userBooks);
        return {
          text: `Рекомендации для чтения:\n\n${recommendations}`,
          source: 'recommendation'
        };
      }
      
      // Подготовка контекста для ИИ
      const booksContext = userBooks.length > 0 ? 
        `Библиотека пользователя содержит ${userBooks.length} книг: ${userBooks.map(b => `"${b.title}" (${b.author})`).join(', ')}.` :
        'Библиотека пользователя пуста.';
      
      const messages = [
        {
          role: "system",
          content: `Ты - умный помощник для цифровой библиотеки. Ты помогаешь пользователям с книгами, анализом чтения, рекомендациями и общими вопросами о литературе. 
          
          Контекст: ${booksContext}
          
          Отвечай дружелюбно и полезно на русском языке. Если вопрос касается книг пользователя, используй информацию из контекста.`
        },
        {
          role: "user",
          content: question
        }
      ];

      const aiResponse = await this.callOpenRouterAPI(messages);
      
      // Очищаем ответ от служебных тегов
      const cleanedResponse = aiResponse
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Удаляем теги <think>
        .replace(/<thinking>[\s\S]*?<\/thinking>/g, '') // Удаляем теги <thinking>
        .replace(/^\s+|\s+$/g, '') // Убираем лишние пробелы
        .trim();
      
      return {
        text: cleanedResponse,
        source: 'ai',
        confidence: 0.8,
        suggestions: [
          'Расскажи о содержании книги [название]',
          'Какая моя статистика чтения?',
          'Что мне почитать дальше?',
          'Проанализируй мои предпочтения'
        ]
      };
      
    } catch (error) {
      console.error('AI Response Error:', error);
      
      // Fallback к поиску в интернете
      try {
        const searchResults = await this.searchInternet(question);
        return {
          text: `Результат поиска:\n\n${searchResults[0]?.snippet || 'Информация не найдена'}`,
          source: 'internet',
          results: searchResults.slice(0, 3)
        };
      } catch (searchError) {
        return {
          text: 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте переформулировать вопрос или задать более конкретный вопрос о ваших книгах.',
          source: 'error',
          suggestions: [
            'Расскажи о содержании книги [название]',
            'Какая моя статистика чтения?',
            'Что мне почитать дальше?',
            'Найди цитаты о [тема] в моих книгах'
          ]
        };
      }
    }
  }

  analyzeLibraryStats(books) {
    const totalBooks = books.length;
    const textBooks = books.filter(b => b.type === 'text').length;
    const audioBooks = books.filter(b => b.type === 'audio').length;
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
    const totalReadingTime = books.reduce((sum, book) => {
      const time = book.estimatedReadingTime || '0 мин';
      const minutes = parseInt(time.match(/\d+/) || [0])[0];
      return sum + (time.includes('ч') ? minutes * 60 : minutes);
    }, 0);
    
    const languages = {};
    books.forEach(book => {
      const lang = book.language || 'unknown';
      languages[lang] = (languages[lang] || 0) + 1;
    });
    
    const stats = [
      `📚 Всего книг: ${totalBooks}`,
      `📖 Текстовых: ${textBooks}`,
      `🎧 Аудиокниг: ${audioBooks}`,
      `📝 Общее количество слов: ${totalWords.toLocaleString()}`,
      `⏱️ Время чтения: ${Math.floor(totalReadingTime / 60)} ч ${totalReadingTime % 60} мин`,
      `🌍 Языки: ${Object.entries(languages).map(([lang, count]) => `${lang} (${count})`).join(', ')}`
    ];
    
    return stats.join('\n');
  }

  generateBookRecommendations(books) {
    if (books.length === 0) {
      return 'Пока нет книг в библиотеке. Добавьте несколько книг, чтобы получить персональные рекомендации!';
    }
    
    // Анализируем существующие книги для рекомендаций
    const unreadBooks = books.filter(book => {
      const progress = (book.progress || 0);
      return progress < 100; // Книги, которые не полностью прочитаны
    });
    
    const completedBooks = books.filter(book => {
      const progress = (book.progress || 0);
      return progress >= 100;
    });
    
    const inProgressBooks = books.filter(book => {
      const progress = (book.progress || 0);
      return progress > 0 && progress < 100;
    });
    
    const recommendations = ['На основе вашей библиотеки рекомендую:'];
    
    // Рекомендуем продолжить чтение начатых книг
    if (inProgressBooks.length > 0) {
      recommendations.push('', '📖 Продолжите чтение:');
      inProgressBooks.slice(0, 3).forEach(book => {
        recommendations.push(`📚 "${book.title}" - ${book.author} (${Math.round(book.progress || 0)}% прочитано)`);
      });
    }
    
    // Рекомендуем непрочитанные книги
    if (unreadBooks.length > 0) {
      recommendations.push('', '🆕 Начните читать:');
      unreadBooks.slice(0, 3).forEach(book => {
        let reason = '';
        if (book.type === 'audio') {
          reason = ' (аудиокнига)';
        } else if (book.wordCount && book.wordCount < 50000) {
          reason = ' (короткая)';
        } else if (book.estimatedReadingTime) {
          reason = ` (${book.estimatedReadingTime})`;
        }
        recommendations.push(`📚 "${book.title}" - ${book.author}${reason}`);
      });
    }
    
    // Рекомендуем похожие книги на основе завершенных
    if (completedBooks.length > 0) {
      recommendations.push('', '🔄 Похожие на прочитанные:');
      const favoriteAuthors = {};
      completedBooks.forEach(book => {
        if (book.author) {
          favoriteAuthors[book.author] = (favoriteAuthors[book.author] || 0) + 1;
        }
      });
      
      // Находим книги тех же авторов
      const sameAuthorBooks = books.filter(book => {
        const progress = (book.progress || 0);
        return progress < 100 && favoriteAuthors[book.author];
      });
      
      sameAuthorBooks.slice(0, 2).forEach(book => {
        recommendations.push(`📚 "${book.title}" - ${book.author} (любимый автор)`);
      });
    }
    
    // Статистика
    recommendations.push('');
    recommendations.push(`📊 В библиотеке: ${books.length} книг`);
    recommendations.push(`✅ Завершено: ${completedBooks.length} книг`);
    recommendations.push(`📖 В процессе: ${inProgressBooks.length} книг`);
    recommendations.push(`🆕 Не начато: ${unreadBooks.length} книг`);
    
    return recommendations.join('\n');
  }

  getStatistics() {
    const total = this.learningData.length;
    const today = new Date().toDateString();
    const todayCount = this.learningData.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    ).length;
    
    const keywordFreq = {};
    this.learningData.forEach(entry => {
      entry.keywords.forEach(keyword => {
        keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
      });
    });
    
    const topKeywords = Object.entries(keywordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    return {
      totalInteractions: total,
      todayInteractions: todayCount,
      topKeywords,
      learningRate: total > 0 ? todayCount / total : 0,
      accuracy: this.calculateAccuracy()
    };
  }

  calculateAccuracy() {
    const ratedInteractions = this.learningData.filter(entry => entry.satisfaction !== null);
    if (ratedInteractions.length === 0) return 0;
    
    const positiveRatings = ratedInteractions.filter(entry => entry.satisfaction > 3).length;
    return positiveRatings / ratedInteractions.length;
  }

  rateSatisfaction(questionId, rating) {
    const entry = this.learningData.find(entry => entry.timestamp === questionId);
    if (entry) {
      entry.satisfaction = rating;
      localStorage.setItem('aiLearningData', JSON.stringify(this.learningData));
    }
  }
}

// Система рекомендаций
class RecommendationEngine {
  constructor() {
    this.userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    this.genreWeights = {};
    this.authorPreferences = {};
    this.readingPatterns = {};
  }

  analyzeReadingPattern(books, readingHistory) {
    const patterns = {
      genres: {},
      authors: {},
      readingTime: {},
      bookLength: {},
      languages: {},
      completionRate: 0
    };

    let completedBooks = 0;

    books.forEach(book => {
      const stats = readingHistory[book.id] || {};
      
      // Анализ по авторам
      if (book.author) {
        patterns.authors[book.author] = (patterns.authors[book.author] || 0) + 1;
      }

      // Анализ по жанрам
      if (book.genres) {
        book.genres.forEach(genre => {
          patterns.genres[genre] = (patterns.genres[genre] || 0) + 1;
        });
      }

      // Анализ по языкам
      if (book.language) {
        patterns.languages[book.language] = (patterns.languages[book.language] || 0) + 1;
      }

      // Анализ по времени чтения
      if (stats.lastRead) {
        const hour = new Date(stats.lastRead).getHours();
        patterns.readingTime[hour] = (patterns.readingTime[hour] || 0) + 1;
      }

      // Анализ по длине книг
      const chapterCount = book.chapters?.length || 0;
      const lengthCategory = chapterCount < 5 ? 'short' : chapterCount < 15 ? 'medium' : 'long';
      patterns.bookLength[lengthCategory] = (patterns.bookLength[lengthCategory] || 0) + 1;

      // Подсчет завершенных книг
      if (stats.progress >= 100) {
        completedBooks++;
      }
    });

    patterns.completionRate = books.length > 0 ? completedBooks / books.length : 0;

    return patterns;
  }

  generateRecommendations(books, readingHistory) {
    if (books.length === 0) {
      return [];
    }
    
    const patterns = this.analyzeReadingPattern(books, readingHistory);
    
    // Анализируем существующие книги для создания персонализированных рекомендаций
    const unreadBooks = books.filter(book => {
      const progress = readingHistory[book.id]?.progress || 0;
      return progress < 100; // Книги, которые не полностью прочитаны
    });
    
    const completedBooks = books.filter(book => {
      const progress = readingHistory[book.id]?.progress || 0;
      return progress >= 100;
    });
    
    const inProgressBooks = books.filter(book => {
      const progress = readingHistory[book.id]?.progress || 0;
      return progress > 0 && progress < 100;
    });
    
    const recommendations = [];
    
    // Рекомендуем продолжить чтение начатых книг (высший приоритет)
    inProgressBooks.forEach(book => {
      const progress = readingHistory[book.id]?.progress || 0;
      recommendations.push({
        ...book,
        id: `continue_${book.id}`,
        recommended: true,
        personalizedScore: 5.0 + (progress / 100), // Высокий скор для продолжения
        personalizedReason: `Продолжить чтение (${Math.round(progress)}% прочитано)`,
        recommendationType: 'continue'
      });
    });
    
    // Рекомендуем непрочитанные книги на основе предпочтений
    unreadBooks.forEach(book => {
      let score = 3.0; // Базовый скор для непрочитанных
      let reasons = [];
      
      // Бонус за предпочитаемых авторов
      if (patterns.authors[book.author]) {
        score += 1.0;
        reasons.push('любимый автор');
      }
      
      // Бонус за предпочитаемые жанры
      if (book.genres && book.genres.some(genre => patterns.genres[genre])) {
        score += 0.8;
        reasons.push('интересный жанр');
      }
      
      // Бонус за предпочитаемый язык
      if (patterns.languages[book.language]) {
        score += 0.3;
      }
      
      // Учет предпочитаемой длины книг
      const chapterCount = book.chapters?.length || 0;
      const lengthCategory = chapterCount < 5 ? 'short' : chapterCount < 15 ? 'medium' : 'long';
      const preferredLength = Object.entries(patterns.bookLength)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      
      if (preferredLength === lengthCategory) {
        score += 0.5;
        reasons.push('подходящая длина');
      }
      
      // Бонус за тип книги (аудио/текст)
      const audioCount = books.filter(b => b.type === 'audio').length;
      const textCount = books.filter(b => b.type === 'text').length;
      
      if (book.type === 'audio' && audioCount > textCount) {
        score += 0.4;
        reasons.push('аудиокнига');
      } else if (book.type === 'text' && textCount > audioCount) {
        score += 0.4;
        reasons.push('текстовая книга');
      }
      
      // Бонус за короткие книги, если пользователь редко дочитывает
      if (patterns.completionRate < 0.5 && lengthCategory === 'short') {
        score += 0.6;
        reasons.push('короткая книга');
      }
      
      const reasonText = reasons.length > 0 ? reasons.join(', ') : 'новая книга для вас';
      
      recommendations.push({
        ...book,
        id: `unread_${book.id}`,
        recommended: true,
        personalizedScore: score,
        personalizedReason: `Рекомендуем начать (${reasonText})`,
        recommendationType: 'unread'
      });
    });
    
    // Рекомендуем перечитать любимые книги
    if (completedBooks.length > 0) {
      const favoriteBooks = completedBooks
        .filter(book => {
          const bookmarks = readingHistory[book.id]?.bookmarkAdded;
          return bookmarks; // Книги с закладками считаются любимыми
        })
        .slice(0, 2);
      
      favoriteBooks.forEach(book => {
        recommendations.push({
          ...book,
          id: `reread_${book.id}`,
          recommended: true,
          personalizedScore: 2.5,
          personalizedReason: 'Перечитать любимую книгу',
          recommendationType: 'reread'
        });
      });
    }
    
    // Сортируем по персонализированному скору и возвращаем топ-6
    return recommendations
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, 6);
  }

  updateProfile(action, book) {
    if (!this.userProfile.preferences) {
      this.userProfile.preferences = {};
    }

    if (action === 'read' && book.author) {
      this.userProfile.preferences[book.author] = 
        (this.userProfile.preferences[book.author] || 0) + 1;
    }

    if (action === 'completed' && book.genres) {
      book.genres.forEach(genre => {
        this.genreWeights[genre] = (this.genreWeights[genre] || 0) + 2;
      });
    }

    if (action === 'liked' && book.author) {
      this.authorPreferences[book.author] = 
        (this.authorPreferences[book.author] || 0) + 3;
    }

    this.userProfile.genreWeights = this.genreWeights;
    this.userProfile.authorPreferences = this.authorPreferences;
    this.userProfile.lastUpdate = Date.now();

    localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
  }

  getReadingInsights(books, readingHistory) {
    const patterns = this.analyzeReadingPattern(books, readingHistory);
    
    const insights = [];
    
    // Любимые жанры
    const topGenres = Object.entries(patterns.genres)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (topGenres.length > 0) {
      insights.push(`Ваши любимые жанры: ${topGenres.map(([genre, count]) => `${genre} (${count} книг)`).join(', ')}`);
    }
    
    // Любимые авторы
    const topAuthors = Object.entries(patterns.authors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (topAuthors.length > 0) {
      insights.push(`Предпочитаемые авторы: ${topAuthors.map(([author, count]) => `${author} (${count} книг)`).join(', ')}`);
    }
    
    // Время чтения
    const topReadingTimes = Object.entries(patterns.readingTime)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    
    if (topReadingTimes.length > 0) {
      const timeRanges = topReadingTimes.map(([hour, count]) => {
        const hourNum = parseInt(hour);
        if (hourNum >= 6 && hourNum < 12) return 'утром';
        if (hourNum >= 12 && hourNum < 18) return 'днем';
        if (hourNum >= 18 && hourNum < 22) return 'вечером';
        return 'ночью';
      });
      
      insights.push(`Предпочитаете читать: ${timeRanges.join(', ')}`);
    }
    
    // Скорость завершения
    if (patterns.completionRate > 0.8) {
      insights.push('Вы дочитываете большинство начатых книг - отличная дисциплина!');
    } else if (patterns.completionRate > 0.5) {
      insights.push('Стараетесь дочитывать книги до конца, но иногда переключаетесь на новые');
    } else {
      insights.push('Любите начинать новые книги - попробуйте выбирать более короткие произведения');
    }
    
    return insights;
  }
}

const LiquidGlassLibrary = () => {
  // Добавляем стили для экстра маленьких экранов
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width: 475px) {
        .xs\\:block { display: block !important; }
        .xs\\:flex { display: flex !important; }
        .xs\\:hidden { display: none !important; }
        .xs\\:inline { display: inline !important; }
      }
      
      /* Улучшение прокрутки на мобильных */
      .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .overflow-x-auto::-webkit-scrollbar {
        display: none;
      }
      
      /* Адаптивная высота для мобильных */
      @media (max-height: 600px) {
        .max-h-\\[95vh\\] {
          max-height: 100vh !important;
        }
      }
      
      /* Улучшение тач взаимодействий */
      .touch-target {
        min-height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Дополнительные адаптивные размеры */
      @media (max-width: 640px) {
        .touch-target {
          min-height: 40px;
          min-width: 40px;
        }
      }
      
      /* Улучшение читаемости на маленьких экранах */
      @media (max-width: 640px) {
        .prose {
          font-size: 16px;
          line-height: 1.6;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Основные состояния
  const [books, setBooks] = useStoredState('books', []);
  const [currentView, setCurrentView] = useState('library');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const isDarkMode = true; // Fixed to dark mode only
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // TTS состояния
  const [ttsSettings, setTtsSettings] = useStoredState('ttsSettings', {
    voice: '',
    rate: 1,
    pitch: 1,
    volume: 1
  });
  const [ttsVoices, setTtsVoices] = useState([]);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [sentences, setSentences] = useState([]);
  
  // Загрузка файлов
  const [uploadProgress, setUploadProgress] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' или 'url'
  
  // Экспорт/Импорт библиотеки
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [importExportProgress, setImportExportProgress] = useState(null);
  const [importStrategy, setImportStrategy] = useState('merge'); // 'merge', 'replace', 'keep-existing'
  const [lastExportInfo, setLastExportInfo] = useState(null);
  
  // Загрузка аудио по URL
  const [audioUrls, setAudioUrls] = useState('');
  const [audioBookTitle, setAudioBookTitle] = useState('');
  const [audioBookAuthor, setAudioBookAuthor] = useState('');
  const [audioLoadProgress, setAudioLoadProgress] = useState(null);
  
  // Закладки и статистика
  const [bookmarks, setBookmarks] = useStoredState('bookmarks', {});
  const [readingStats, setReadingStats] = useStoredState('readingStats', {});
  const [achievements, setAchievements] = useStoredState('achievements', {});
  
  // ИИ помощник
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  
  // Модальные окна
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  
  // Рефы
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const ttsManagerRef = useRef(null);
  const aiAssistantRef = useRef(null);
  const recommendationEngineRef = useRef(null);
  
  // Инициализация
  useEffect(() => {
    ttsManagerRef.current = new TTSManager();
    aiAssistantRef.current = new AIAssistant();
    recommendationEngineRef.current = new RecommendationEngine();
    
    initializeTTS();
    
    // Показываем предупреждение, если API ключ не установлен
    if (!aiAssistantRef.current.apiKey) {
      console.warn('⚠️ API ключ OpenRouter не установлен. ИИ функции будут ограничены.');
      console.info('💡 Для включения ИИ установите ключ через: localStorage.setItem("openrouter_api_key", "ваш_ключ")');
    }
  }, []);

  const initializeTTS = async () => {
    const voices = await ttsManagerRef.current.initVoices();
    setTtsVoices(voices);
    
    // Установка коллбеков для TTS
    ttsManagerRef.current.setCallbacks({
      onSentenceStart: (index, text) => {
        setCurrentSentence(index);
      },
      onSentenceEnd: (index) => {
        // Обновление прогресса чтения
        updateReadingProgress();
      },
      onEnd: () => {
        setIsTTSPlaying(false);
        setCurrentSentence(0);
      }
    });
  };

  // Функции экспорта/импорта библиотеки
  const handleExportLibrary = async () => {
    try {
      setImportExportProgress({ status: 'exporting', progress: 0, message: 'Подготавливаю данные для экспорта...' });
      
      const userSettings = {
        darkMode: isDarkMode,
        ttsSettings: ttsSettings
      };
      
      setImportExportProgress({ status: 'exporting', progress: 50, message: 'Создаю файл экспорта...' });
      
      const exportResult = await LibraryManager.exportLibrary(
        books, 
        readingStats, 
        bookmarks, 
        achievements, 
        userSettings
      );
      
      setLastExportInfo(exportResult);
      setImportExportProgress({ 
        status: 'completed', 
        progress: 100, 
        message: `Экспорт завершен! Файл: ${exportResult.fileName}` 
      });
      
      setTimeout(() => {
        setImportExportProgress(null);
        setShowImportExportModal(false);
      }, 3000);
      
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      setImportExportProgress({ 
        status: 'error', 
        progress: 0, 
        message: `Ошибка экспорта: ${error.message}` 
      });
      
      setTimeout(() => {
        setImportExportProgress(null);
      }, 5000);
    }
  };

  const handleImportLibrary = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setImportExportProgress({ status: 'importing', progress: 0, message: 'Начинаю импорт библиотеки...' });
      
      const importResult = await LibraryManager.importLibrary(file, (progress) => {
        setImportExportProgress(prev => ({ ...prev, ...progress }));
      });
      
      if (importResult.success) {
        // Применяем стратегию слияния
        const mergedBooks = await LibraryManager.mergeWithExistingLibrary(
          books, 
          importResult.data.books, 
          importStrategy
        );
        
        // Обновляем состояние приложения
        setBooks(mergedBooks);
        
        // Обновляем остальные данные в зависимости от стратегии
        if (importStrategy === 'replace') {
          setReadingStats(importResult.data.readingStats);
          setBookmarks(importResult.data.bookmarks);
          setAchievements(importResult.data.achievements);
          
          if (importResult.data.userSettings.darkMode !== undefined) {
            setIsDarkMode(importResult.data.userSettings.darkMode);
          }
          if (importResult.data.userSettings.ttsSettings) {
            setTtsSettings(importResult.data.userSettings.ttsSettings);
          }
        } else {
          // Слияние данных
          setReadingStats(prev => ({ ...prev, ...importResult.data.readingStats }));
          setBookmarks(prev => ({ ...prev, ...importResult.data.bookmarks }));
          setAchievements(prev => ({ ...prev, ...importResult.data.achievements }));
        }
        
        setImportExportProgress({ 
          status: 'completed', 
          progress: 100, 
          message: `Импорт завершен! Добавлено ${importResult.importStats.booksImported} книг` 
        });
        
        setTimeout(() => {
          setImportExportProgress(null);
          setShowImportExportModal(false);
        }, 3000);
      }
      
    } catch (error) {
      console.error('Ошибка импорта:', error);
      setImportExportProgress({ 
        status: 'error', 
        progress: 0, 
        message: `Ошибка импорта: ${error.message}` 
      });
      
      setTimeout(() => {
        setImportExportProgress(null);
      }, 5000);
    }
    
    event.target.value = '';
  };

  // Функции для работы с файлами
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setShowUploadModal(false);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `file_${Date.now()}_${i}`;
      
      try {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { status: 'parsing', progress: 0, message: 'Начинаю обработку...', fileName: file.name }
        }));
        
        const bookData = await AdvancedFileParser.parseFile(file, (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: { ...prev[fileId], ...progress, fileName: file.name }
          }));
        });
        
        // Анализ качества парсинга
        const quality = AdvancedFileParser.analyzeParsingQuality(bookData);
        
        const newBook = {
          id: `book_${Date.now()}_${Math.random()}`,
          ...bookData,
          type: 'text',
          addedDate: new Date().toISOString(),
          progress: 0,
          currentChapter: 0,
          cover: `keys/book-cover-${encodeURIComponent(bookData.title)}?prompt=${encodeURIComponent(bookData.title + ' book cover classic literature')}`,
          parsingQuality: quality,
          language: bookData.language || AdvancedFileParser.detectLanguageAdvanced(bookData.chapters?.map(ch => ch.content).join(' ') || ''),
          detectedGenres: bookData.detectedGenres || []
        };
        
        setBooks(prev => [...prev, newBook]);
        updateReadingStats(newBook.id, { added: true });
        
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { status: 'completed', progress: 100, message: 'Книга успешно добавлена!', fileName: file.name }
        }));
        
        // Удаляем прогресс через 3 секунды
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 3000);
        
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { status: 'error', progress: 0, message: `Ошибка: ${error.message}`, fileName: file.name }
        }));
        
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 5000);
      }
    }
    
    event.target.value = '';
  };

  const handleAudioUpload = async (event) => {
    const files = Array.from(event.target.files);
    setShowUploadModal(false);
    
    if (files.length === 0) return;
    
    // Создание новой аудиокниги
    const audioBook = {
      id: `audiobook_${Date.now()}`,
      title: audioBookTitle || `Аудиокнига ${files.length} глав`,
      author: audioBookAuthor || 'Неизвестный автор',
      type: 'audio',
      chapters: files.map((file, index) => ({
        title: `Глава ${index + 1}`,
        url: URL.createObjectURL(file),
        duration: 0,
        size: file.size
      })),
      addedDate: new Date().toISOString(),
      progress: 0,
      currentChapter: 0,
      cover: "assets/audiobook-cover.png?prompt=audiobook%20headphones%20sound%20waves%20modern%20design",
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    };
    
    setBooks(prev => [...prev, audioBook]);
    updateReadingStats(audioBook.id, { added: true });
    
    // Сброс полей
    setAudioBookTitle('');
    setAudioBookAuthor('');
    event.target.value = '';
  };

  const handleAudioUrlsLoad = async () => {
    if (!audioUrls.trim()) return;
    
    const urls = audioUrls.split('\n').filter(url => url.trim());
    
    if (urls.length === 0) {
      alert('Введите корректные URL адреса');
      return;
    }
    
    try {
      setAudioLoadProgress({ status: 'loading', current: 0, total: urls.length });
      
      const chapters = await AudioBookLoader.loadMultipleFromURLs(urls, (progress) => {
        setAudioLoadProgress(prev => ({ ...prev, ...progress }));
      });
      
      if (chapters.length === 0) {
        alert('Не удалось загрузить ни одного аудиофайла');
        return;
      }
      
      const audioBook = await AudioBookLoader.createAudioBook(
        chapters,
        audioBookTitle || `Аудиокнига ${chapters.length} глав`,
        audioBookAuthor || 'Неизвестный автор'
      );
      
      setBooks(prev => [...prev, audioBook]);
      updateReadingStats(audioBook.id, { added: true });
      
      // Сброс полей
      setAudioUrls('');
      setAudioBookTitle('');
      setAudioBookAuthor('');
      setShowUploadModal(false);
      
      setAudioLoadProgress({ status: 'completed', current: chapters.length, total: urls.length });
      
      setTimeout(() => {
        setAudioLoadProgress(null);
      }, 3000);
      
    } catch (error) {
      console.error('Ошибка загрузки аудиокниги:', error);
      setAudioLoadProgress({ status: 'error', error: error.message });
      
      setTimeout(() => {
        setAudioLoadProgress(null);
      }, 5000);
    }
  };

  // Функции для работы с закладками
  const addBookmark = (note = '') => {
    if (!selectedBook) return;
    
    const bookmark = {
      id: `bookmark_${Date.now()}`,
      bookId: selectedBook.id,
      chapterIndex: currentChapter,
      timestamp: Date.now(),
      note,
      type: selectedBook.type
    };
    
    if (selectedBook.type === 'audio') {
      bookmark.audioTime = currentTime;
    } else {
      bookmark.scrollPosition = window.scrollY;
      bookmark.sentenceIndex = currentSentence;
    }
    
    setBookmarks(prev => ({
      ...prev,
      [selectedBook.id]: [...(prev[selectedBook.id] || []), bookmark]
    }));
    
    updateReadingStats(selectedBook.id, { bookmarkAdded: true });
  };

  const goToBookmark = (bookmark) => {
    const book = books.find(b => b.id === bookmark.bookId);
    if (!book) return;
    
    setSelectedBook(book);
    setCurrentChapter(bookmark.chapterIndex);
    setCurrentView(book.type === 'audio' ? 'audio' : 'reader');
    
    if (book.type === 'audio' && bookmark.audioTime) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = bookmark.audioTime;
        }
      }, 100);
    } else if (bookmark.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, bookmark.scrollPosition);
      }, 100);
    }
    
    setShowBookmarksModal(false);
  };

  // Функции для статистики
  const updateReadingStats = (bookId, update) => {
    setReadingStats(prev => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        ...update,
        lastRead: Date.now()
      }
    }));
    
    checkAchievements();
  };

  const updateReadingProgress = () => {
    if (!selectedBook) return;
    
    let progress = 0;
    
    if (selectedBook.type === 'text') {
      // Прогресс по главам и предложениям
      const chapterProgress = (currentChapter + 1) / selectedBook.chapters.length;
      const sentenceProgress = sentences.length > 0 ? (currentSentence + 1) / sentences.length : 0;
      progress = (chapterProgress + (sentenceProgress / selectedBook.chapters.length)) * 100;
    } else if (selectedBook.type === 'audio') {
      // Прогресс по времени аудио
      const chapterProgress = (currentChapter + 1) / selectedBook.chapters.length;
      const timeProgress = duration > 0 ? currentTime / duration : 0;
      progress = (chapterProgress + (timeProgress / selectedBook.chapters.length)) * 100;
    }
    
    progress = Math.min(Math.max(progress, 0), 100);
    
    updateReadingStats(selectedBook.id, { progress });
    
    // Обновляем прогресс в книге
    setBooks(prev => prev.map(book => 
      book.id === selectedBook.id 
        ? { ...book, progress, currentChapter }
        : book
    ));
  };

  const checkAchievements = () => {
    const stats = calculateStats();
    const newAchievements = {};
    
    if (stats.totalBooks >= 10) newAchievements.collector = true;
    if (stats.completedBooks >= 5) newAchievements.reader = true;
    if (stats.totalBookmarks >= 50) newAchievements.bookmarker = true;
    if (stats.booksThisMonth >= 3) newAchievements.active = true;
    if (stats.totalWords >= 100000) newAchievements.wordMaster = true;
    if (stats.readingStreak >= 7) newAchievements.consistent = true;
    
    setAchievements(newAchievements);
  };

  const calculateStats = () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const totalBooks = books.length;
    const completedBooks = books.filter(book => {
      const progress = readingStats[book.id]?.progress || 0;
      return progress >= 100;
    }).length;
    
    const totalBookmarks = Object.values(bookmarks).flat().length;
    const booksThisMonth = books.filter(book => 
      new Date(book.addedDate) >= thisMonth
    ).length;
    
    const booksInProgress = books.filter(book => {
      const progress = readingStats[book.id]?.progress || 0;
      return progress > 0 && progress < 100;
    }).length;
    
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
    
    // Подсчет дней подряд чтения
    const readingDays = Object.values(readingStats)
      .filter(stat => stat.lastRead)
      .map(stat => new Date(stat.lastRead).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort()
      .reverse();
    
    let readingStreak = 0;
    for (let i = 0; i < readingDays.length; i++) {
      const date = new Date(readingDays[i]);
      const expectedDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        readingStreak++;
      } else {
        break;
      }
    }
    
    return {
      totalBooks,
      completedBooks,
      booksInProgress,
      totalBookmarks,
      booksThisMonth,
      totalWords,
      readingStreak
    };
  };

  // ИИ помощник функции
  const handleAIMessage = async () => {
    if (!aiInput.trim()) return;
    
    const userMessage = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { type: 'user', content: userMessage, timestamp: Date.now() }]);
    setAiLoading(true);
    
    try {
      const response = await aiAssistantRef.current.generateResponse(userMessage, books);
      
      // Очищаем ответ от служебных тегов
      const cleanedResponse = response.text
        .replace(/<think>[\s\S]*?<\/think>/g, '') // Удаляем теги <think>
        .replace(/<thinking>[\s\S]*?<\/thinking>/g, '') // Удаляем теги <thinking>
        .replace(/^\s+|\s+$/g, '') // Убираем лишние пробелы
        .trim();

      const aiMessage = { 
        type: 'ai', 
        content: cleanedResponse,
        source: response.source,
        confidence: response.confidence,
        suggestions: response.suggestions,
        relatedQuestions: response.relatedQuestions,
        timestamp: Date.now(),
        id: `ai_${Date.now()}_${Math.random()}`
      };

      setAiMessages(prev => [...prev, aiMessage]);
      
      // Автоматическая озвучка ответа ИИ
      setTimeout(() => {
        speakAIResponse(cleanedResponse, aiMessage.id);
      }, 500);
      
      // Обучение ИИ
      aiAssistantRef.current.learnFromInteraction(userMessage, response.text, selectedBook?.title);
      
    } catch (error) {
      const errorMessage = { 
        type: 'ai', 
        content: 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз.',
        timestamp: Date.now(),
        id: `ai_error_${Date.now()}`
      };
      
      setAiMessages(prev => [...prev, errorMessage]);
      
      // Озвучиваем и сообщение об ошибке
      setTimeout(() => {
        speakAIResponse(errorMessage.content, errorMessage.id);
      }, 500);
    }
    
    setAiLoading(false);
  };

  // Функция озвучки ответов ИИ
  const speakAIResponse = (text, messageId) => {
    // Проверяем настройки озвучки ИИ
    const aiTtsEnabled = localStorage.getItem('aiTtsEnabled') !== 'false'; // По умолчанию включено
    if (!aiTtsEnabled) return;

    // Останавливаем текущую озвучку если она идет
    if (ttsManagerRef.current.isPlaying) {
      ttsManagerRef.current.stop();
    }

    // Создаем отдельный TTS для ИИ ответов
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Настройки голоса для ИИ (можно сделать отдельные настройки)
    const aiVoice = ttsVoices.find(v => 
      v.lang.startsWith('ru') && 
      (v.name.toLowerCase().includes('elena') || 
       v.name.toLowerCase().includes('maria') ||
       v.name.toLowerCase().includes('female'))
    ) || ttsVoices.find(v => v.lang.startsWith('ru')) || ttsVoices[0];
    
    if (aiVoice) utterance.voice = aiVoice;
    utterance.rate = 1.1; // Чуть быстрее обычного чтения
    utterance.pitch = 1.1; // Чуть выше для различения
    utterance.volume = ttsSettings.volume || 1;

    // Отмечаем сообщение как озвучиваемое
    setAiMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isPlaying: true }
        : { ...msg, isPlaying: false }
    ));

    utterance.onstart = () => {
      console.log('Озвучка ИИ началась');
    };

    utterance.onend = () => {
      // Убираем отметку о воспроизведении
      setAiMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isPlaying: false }
          : msg
      ));
    };

    utterance.onerror = (event) => {
      console.error('Ошибка озвучки ИИ:', event.error);
      setAiMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isPlaying: false }
          : msg
      ));
    };

    // Запускаем озвучку
    window.speechSynthesis.speak(utterance);
  };

  // Функция остановки озвучки ИИ
  const stopAIVoice = () => {
    window.speechSynthesis.cancel();
    setAiMessages(prev => prev.map(msg => ({ ...msg, isPlaying: false })));
  };

  // Функция переключения автоозвучки ИИ
  const toggleAITTS = () => {
    const currentEnabled = localStorage.getItem('aiTtsEnabled') !== 'false';
    const newEnabled = !currentEnabled;
    localStorage.setItem('aiTtsEnabled', newEnabled.toString());
    
    if (!newEnabled) {
      stopAIVoice();
    }
  };

  // Функции для управления API ключом
  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('openrouter_api_key', tempApiKey.trim());
      // Обновляем API ключ в существующем экземпляре
      if (aiAssistantRef.current) {
        aiAssistantRef.current.apiKey = tempApiKey.trim();
      }
      setShowApiKeyModal(false);
      setTempApiKey('');
      
      // Показываем сообщение об успехе
      setAiMessages(prev => [...prev, {
        type: 'ai',
        content: '✅ API ключ успешно сохранен! Теперь я готов отвечать на ваши вопросы.',
        timestamp: Date.now(),
        id: `ai_success_${Date.now()}`
      }]);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('openrouter_api_key');
    if (aiAssistantRef.current) {
      aiAssistantRef.current.apiKey = '';
    }
    setShowApiKeyModal(false);
    setTempApiKey('');
    
    // Показываем сообщение об удалении
    setAiMessages(prev => [...prev, {
      type: 'ai',
      content: '🔑 API ключ удален. Для полноценной работы ИИ необходимо добавить новый ключ.',
      timestamp: Date.now(),
      id: `ai_removed_${Date.now()}`
    }]);
  };

  const openApiKeyModal = () => {
    const currentKey = localStorage.getItem('openrouter_api_key') || '';
    setTempApiKey(currentKey);
    setShowApiKeyModal(true);
  };

  // TTS функции
  const startTTS = () => {
    if (!selectedBook || selectedBook.type !== 'text') return;
    
    const chapter = selectedBook.chapters[currentChapter];
    if (!chapter) return;
    
    const chapterSentences = ttsManagerRef.current.splitIntoSentences(chapter.content);
    setSentences(chapterSentences);
    
    ttsManagerRef.current.speak(chapter.content, ttsSettings);
    setIsTTSPlaying(true);
  };

  const stopTTS = () => {
    ttsManagerRef.current.stop();
    setIsTTSPlaying(false);
    setCurrentSentence(0);
  };

  const pauseTTS = () => {
    if (isTTSPlaying) {
      ttsManagerRef.current.pause();
      setIsTTSPlaying(false);
    } else {
      ttsManagerRef.current.resume();
      setIsTTSPlaying(true);
    }
  };

  // Аудио функции
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeChapter = (direction) => {
    if (!selectedBook) return;
    
    const newChapter = currentChapter + direction;
    if (newChapter >= 0 && newChapter < selectedBook.chapters.length) {
      setCurrentChapter(newChapter);
      setCurrentTime(0);
      
      if (selectedBook.type === 'audio' && audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      
      // Остановка TTS при смене главы
      if (isTTSPlaying) {
        stopTTS();
      }
      
      updateReadingProgress();
    }
  };

  // Поиск и фильтрация
  const filteredBooks = books.filter(book => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      (book.genres && book.genres.some(genre => genre.toLowerCase().includes(query)))
    );
  });

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Рендер функций - renderLibrary, renderReader, renderAudioPlayer и модальные окна
  const renderLibrary = () => (
    <div className="space-y-6">
      {/* Поиск и фильтры */}
      <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск книг..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button
              onClick={() => {
                setUploadType('file');
                setShowUploadModal(true);
              }}
              className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 font-medium"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-6 transition-transform duration-300">
                  <Plus size={20} />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">📚 Добавить книгу</div>
                  <div className="text-sm opacity-90">FB2, TXT</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => {
                setUploadType('audio');
                setShowUploadModal(true);
              }}
              className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 font-medium"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-6 transition-transform duration-300">
                  <Headphones size={20} />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">🎧 Аудиокнига</div>
                  <div className="text-sm opacity-90">MP3, WAV, OGG</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setShowImportExportModal(true)}
              className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 text-white rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 font-medium"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-6 transition-transform duration-300">
                  <Download size={20} />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">💾 Библиотека</div>
                  <div className="text-sm opacity-90">Импорт/Экспорт</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Прогресс загрузки */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Загрузка файлов</h3>
          <div className="space-y-3">
            {Object.entries(uploadProgress).map(([fileId, progress]) => (
              <div key={fileId} className="bg-white/5 rounded-lg p-2 sm:p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-xs sm:text-sm font-medium truncate flex-1 mr-2">{progress.fileName}</span>
                  <div className="flex items-center gap-2">
                    {progress.status === 'parsing' && <Loader className="animate-spin text-blue-400" size={16} />}
                    {progress.status === 'completed' && <Check className="text-green-400" size={16} />}
                    {progress.status === 'error' && <AlertCircle className="text-red-400" size={16} />}
                    <span className="text-xs text-gray-300">{progress.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress.status === 'error' ? 'bg-red-500' :
                      progress.status === 'completed' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{progress.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Прогресс загрузки аудио по URL */}
      {audioLoadProgress && (
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Загрузка аудиокниги</h3>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">
                {audioLoadProgress.status === 'loading' ? 'Загружаю главы...' :
                 audioLoadProgress.status === 'completed' ? 'Аудиокнига создана!' :
                 'Ошибка загрузки'}
              </span>
              <div className="flex items-center gap-2">
                {audioLoadProgress.status === 'loading' && <Loader className="animate-spin text-blue-400" size={16} />}
                {audioLoadProgress.status === 'completed' && <Check className="text-green-400" size={16} />}
                {audioLoadProgress.status === 'error' && <AlertCircle className="text-red-400" size={16} />}
                <span className="text-xs text-gray-300">
                  {audioLoadProgress.current}/{audioLoadProgress.total}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  audioLoadProgress.status === 'error' ? 'bg-red-500' :
                  audioLoadProgress.status === 'completed' ? 'bg-green-500' :
                  'bg-blue-500'
                }`}
                style={{ width: `${(audioLoadProgress.current / audioLoadProgress.total) * 100}%` }}
              />
            </div>
            {audioLoadProgress.error && (
              <div className="text-xs text-red-400">{audioLoadProgress.error}</div>
            )}
          </div>
        </div>
      )}

      {/* Элегантные рекомендации */}
      {books.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl">
          {/* Декоративные элементы */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                  <Star className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Рекомендации для вас</h3>
                  <p className="text-sm text-gray-300">Персонально подобранные книги</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <Sparkles className="text-yellow-400 animate-pulse" size={16} />
                <span className="text-xs text-yellow-300 font-medium">ИИ подборка</span>
              </div>
            </div>
            
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-1 px-1 touch-pan-x scrollbar-hide">
              {recommendationEngineRef.current?.generateRecommendations(books, readingStats).slice(0, 6).map((rec, index) => (
                <div 
                  key={rec.id} 
                  className="group flex-shrink-0 w-44 sm:w-52 cursor-pointer touch-target"
                  onClick={() => {
                    setSelectedBook(books.find(b => b.id === rec.id.replace(/^(continue_|unread_|reread_)/, '')));
                    setCurrentChapter(rec.currentChapter || 0);
                    setCurrentView(rec.type === 'audio' ? 'audio' : 'reader');
                  }}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Главная карточка */}
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/25 group-hover:border-purple-400/40">
                    
                    {/* Обложка с улучшенными эффектами */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"></div>
                      <img 
                        src={rec.cover} 
                        alt={rec.title}
                        className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      
                      {/* Градиентные оверлеи */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Статус индикатор с анимацией */}
                      <div className="absolute top-2 left-2">
                        {rec.recommendationType === 'continue' && (
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                            <Play size={10} />
                            Продолжить
                          </div>
                        )}
                        {rec.recommendationType === 'unread' && (
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <BookOpen size={10} />
                            Новинка
                          </div>
                        )}
                        {rec.recommendationType === 'reread' && (
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <RefreshCw size={10} />
                            Перечитать
                          </div>
                        )}
                      </div>
                      
                      {/* Рейтинг в правом углу */}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={10} />
                        <span className="text-white text-xs font-bold">{rec.personalizedScore?.toFixed(1)}</span>
                      </div>
                      
                      {/* Прогресс для продолжения чтения */}
                      {rec.recommendationType === 'continue' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                            style={{ width: `${readingStats[rec.id.replace('continue_', '')]?.progress || 0}%` }}
                          />
                        </div>
                      )}
                      
                      {/* Тип медиа */}
                      <div className="absolute bottom-2 right-2">
                        <div className={`p-1.5 rounded-full backdrop-blur-sm border border-white/20 ${
                          rec.type === 'audio' 
                            ? 'bg-green-500/80 text-white' 
                            : 'bg-blue-500/80 text-white'
                        }`}>
                          {rec.type === 'audio' ? <Headphones size={12} /> : <BookOpen size={12} />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Информация о книге */}
                    <div className="p-3 space-y-2">
                      <h4 className="font-bold text-white text-sm leading-tight line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">
                        {rec.title}
                      </h4>
                      <p className="text-gray-300 text-xs line-clamp-1">{rec.author}</p>
                      
                      {/* Причина рекомендации с иконкой */}
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-purple-300 line-clamp-2 leading-relaxed">
                          {rec.personalizedReason}
                        </p>
                      </div>
                      
                      {/* Дополнительные метрики */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1">
                          <Activity size={10} className="text-green-400" />
                          <span className="text-xs text-green-300 font-medium">
                            {rec.recommendationType === 'continue' ? 'В процессе' :
                             rec.recommendationType === 'unread' ? 'Не прочитано' :
                             'Для повтора'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={10} className="text-red-400" />
                          <span className="text-xs text-red-300">
                            {Math.round(rec.personalizedScore * 20)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover эффект - мерцающая рамка */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                         style={{ background: 'linear-gradient(45deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3), rgba(59,130,246,0.3))' }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Показываем сообщение, если рекомендаций нет */}
            {recommendationEngineRef.current?.generateRecommendations(books, readingStats).length === 0 && (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                    <Star className="text-white animate-pulse" size={32} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white" size={12} />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Готовим рекомендации</h4>
                <p className="text-sm text-gray-300 max-w-md mx-auto">
                  Начните читать книги, и наш ИИ создаст персональные рекомендации на основе ваших предпочтений
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Библиотека книг */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
        {filteredBooks.map(book => {
          const bookStats = readingStats[book.id] || {};
          const progress = bookStats.progress || 0;
          const bookBookmarks = bookmarks[book.id] || [];
          
          return (
            <div
              key={book.id}
              className="group bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedBook(book);
                setCurrentChapter(book.currentChapter || 0);
                setCurrentView(book.type === 'audio' ? 'audio' : 'reader');
              }}
            >
              {/* Обложка книги */}
              <div className="aspect-[2/3] rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 mb-3 sm:mb-4 relative overflow-hidden">
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                
                {/* Индикаторы */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between">
                  {/* Тип книги */}
                  <div className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded sm:rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ${
                    book.type === 'audio' 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-blue-500/90 text-white'
                  }`}>
                    {book.type === 'audio' ? (
                      <>
                        <Headphones size={12} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">🎧</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={12} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">📖</span>
                      </>
                    )}
                  </div>
                  
                  {/* Закладки */}
                  {bookBookmarks.length > 0 && (
                    <div className="bg-red-500 text-white text-xs sm:text-sm rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold">
                      {bookBookmarks.length > 9 ? '9+' : bookBookmarks.length}
                    </div>
                  )}
                </div>

                {/* Язык внизу */}
                {book.language && (
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                    <div className="bg-black/70 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded sm:rounded-lg text-xs sm:text-sm">
                      {book.language.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Информация о книге */}
              <div className="space-y-2 flex-1 flex flex-col">
                <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2 leading-tight flex-grow">
                  {book.title}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm line-clamp-1">
                  {book.author}
                </p>

                {/* Прогресс */}
                <div className="mt-auto">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span className="truncate">{(book.currentChapter || 0) + 1}/{book.chapters?.length || 0}</span>
                    <span className="flex-shrink-0 ml-2 font-medium text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Компактные кнопки действий */}
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBook(book);
                      setCurrentView(book.type === 'audio' ? 'audio' : 'reader');
                    }}
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-2 sm:p-2.5 rounded-lg font-bold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105 active:scale-95"
                    title={book.type === 'audio' ? 'Слушать' : 'Читать'}
                  >
                    {/* Только иконка - компактная */}
                    <div className="relative">
                      {book.type === 'audio' ? (
                        <Headphones size={14} className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <BookOpen size={14} className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBook(book);
                      setShowEditModal(true);
                    }}
                    className="group relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white p-2 sm:p-2.5 rounded-lg font-bold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/25 hover:scale-105 active:scale-95"
                    title="Изменить"
                  >
                    {/* Только иконка - компактная */}
                    <div className="relative">
                      <Edit3 size={14} className="sm:w-4 sm:h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">
            {searchQuery ? 'Книги не найдены' : 'Ваша библиотека пуста'}
          </h3>
          <p className="text-gray-400 mb-6 text-sm sm:text-base px-4">
            {searchQuery 
              ? 'Попробуйте изменить поисковый запрос' 
              : 'Добавьте первую книгу, чтобы начать читать'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => {
                setUploadType('file');
                setShowUploadModal(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
            >
              📚 Добавить книгу
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderReader = () => {
    if (!selectedBook || selectedBook.type !== 'text') return null;
    
    const chapter = selectedBook.chapters[currentChapter];
    if (!chapter) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Навигация по книге */}
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setCurrentView('library')}
                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base flex-shrink-0"
              >
                ← Библиотека
              </button>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">{selectedBook.title}</h2>
                <p className="text-gray-300 text-sm truncate">{selectedBook.author}</p>
                {selectedBook.description && (
                  <p className="hidden sm:block text-gray-400 text-xs mt-1 line-clamp-2">{selectedBook.description.substring(0, 150)}...</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={currentChapter}
                onChange={(e) => setCurrentChapter(Number(e.target.value))}
                className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 flex-1 min-w-0 backdrop-blur-sm"
              >
                {selectedBook.chapters.map((ch, index) => (
                  <option key={index} value={index} className="bg-gray-800">
                    {ch.title.length > 30 ? ch.title.substring(0, 30) + '...' : ch.title}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeChapter(-1)}
                  disabled={currentChapter === 0}
                  className="group p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <SkipBack size={16} className="group-hover:scale-110 transition-transform" />
                </button>
                
                <button
                  onClick={() => changeChapter(1)}
                  disabled={currentChapter >= selectedBook.chapters.length - 1}
                  className="group p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <SkipForward size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Улучшенное TTS управление */}
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={isTTSPlaying ? pauseTTS : startTTS}
                className={`group relative overflow-hidden px-6 py-3 rounded-2xl transition-all duration-300 font-medium shadow-lg ${
                  isTTSPlaying 
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:scale-105 hover:shadow-orange-500/25' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 hover:shadow-green-500/25'
                }`}
              >
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  isTTSPlaying 
                    ? 'bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100'
                }`}></div>
                <div className="relative flex items-center gap-2">
                  {isTTSPlaying ? 
                    <Pause className="text-white group-hover:scale-110 transition-transform" size={18} /> : 
                    <Play className="text-white group-hover:scale-110 transition-transform" size={18} />
                  }
                  <span className="text-white font-bold">
                    {isTTSPlaying ? 'Пауза' : 'Озвучить'}
                  </span>
                </div>
              </button>
              
              <button
                onClick={stopTTS}
                className="group relative overflow-hidden p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <X className="relative text-white group-hover:scale-110 transition-transform" size={18} />
              </button>
              
              <button
                onClick={() => addBookmark(prompt('Добавить заметку к закладке:') || '')}
                className="group relative overflow-hidden p-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/25 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Bookmark className="relative text-white group-hover:scale-110 transition-transform" size={18} />
              </button>
              
              <div className="text-white text-xs sm:text-sm min-w-0 flex-1">
                <div className="truncate">
                  {isTTSPlaying ? 'Воспроизводится' : 'Готов к озвучке'}
                </div>
                {sentences.length > 0 && (
                  <div className="text-gray-300 text-xs">
                    {currentSentence + 1}/{sentences.length}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
              <select
                value={ttsSettings.voice}
                onChange={(e) => setTtsSettings({...ttsSettings, voice: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="" className="bg-gray-800">Голос по умолчанию</option>
                {ttsVoices.filter(voice => voice.lang.startsWith('ru')).map(voice => (
                  <option key={voice.name} value={voice.name} className="bg-gray-800">
                    {voice.name.length > 20 ? voice.name.substring(0, 20) + '...' : voice.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <span className="text-white text-xs sm:text-sm flex-shrink-0">Скорость:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={ttsSettings.rate}
                  onChange={(e) => {
                    const newRate = Number(e.target.value);
                    setTtsSettings({...ttsSettings, rate: newRate});
                    ttsManagerRef.current?.setSpeed(newRate);
                  }}
                  className="flex-1 min-w-0"
                />
                <span className="text-gray-300 text-xs flex-shrink-0">{ttsSettings.rate}x</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white text-xs sm:text-sm flex-shrink-0">Тон:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={ttsSettings.pitch}
                  onChange={(e) => {
                    const newPitch = Number(e.target.value);
                    setTtsSettings({...ttsSettings, pitch: newPitch});
                    ttsManagerRef.current?.setPitch(newPitch);
                  }}
                  className="flex-1 min-w-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="text-gray-300 flex-shrink-0" size={14} />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ttsSettings.volume}
                  onChange={(e) => {
                    const newVolume = Number(e.target.value);
                    setTtsSettings({...ttsSettings, volume: newVolume});
                    ttsManagerRef.current?.setVolume(newVolume);
                  }}
                  className="flex-1 min-w-0"
                />
              </div>
            </div>
          </div>

          {/* Прогресс TTS */}
          {sentences.length > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSentence + 1) / sentences.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Предложение {currentSentence + 1} из {sentences.length}</span>
                <span>{Math.round(((currentSentence + 1) / sentences.length) * 100)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Содержимое главы */}
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6">{chapter.title}</h3>
          
          <div className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed">
            {sentences.length > 0 ? (
              sentences.map((sentence, index) => (
                <span
                  key={index}
                  className={`${
                    index === currentSentence && isTTSPlaying
                      ? 'bg-yellow-500/30 text-yellow-100 rounded px-1'
                      : index < currentSentence && isTTSPlaying
                      ? 'text-green-300'
                      : 'text-gray-100'
                  } transition-all duration-300 cursor-pointer hover:bg-purple-500/20`}
                  onClick={() => {
                    if (isTTSPlaying) {
                      stopTTS();
                      setCurrentSentence(index);
                      setTimeout(() => {
                        startTTS();
                      }, 100);
                    }
                  }}
                >
                  {sentence}{' '}
                </span>
              ))
            ) : (
              <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                {chapter.content}
              </div>
            )}
          </div>

          {/* Статистика главы */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                <div className="text-purple-300 text-xs sm:text-sm">Символов</div>
                <div className="text-white font-bold text-sm sm:text-base">{chapter.content.length.toLocaleString()}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                <div className="text-blue-300 text-xs sm:text-sm">Слов</div>
                <div className="text-white font-bold text-sm sm:text-base">{chapter.content.split(/\s+/).length.toLocaleString()}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                <div className="text-green-300 text-xs sm:text-sm">Предложений</div>
                <div className="text-white font-bold text-sm sm:text-base">{sentences.length || chapter.content.split(/[.!?]+/).length}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-2 sm:p-3">
                <div className="text-yellow-300 text-xs sm:text-sm">Время чтения</div>
                <div className="text-white font-bold text-sm sm:text-base">
                  {Math.ceil(chapter.content.split(/\s+/).length / 200)} мин
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAudioPlayer = () => {
    if (!selectedBook || selectedBook.type !== 'audio') return null;
    
    const chapter = selectedBook.chapters[currentChapter];
    if (!chapter) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Навигация */}
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setCurrentView('library')}
              className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base flex-shrink-0"
            >
              ← Библиотека
            </button>
            
            <div className="text-center min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">{selectedBook.title}</h2>
              <p className="text-gray-300 text-sm truncate">{selectedBook.author}</p>
              {selectedBook.totalSize && (
                <p className="hidden sm:block text-gray-400 text-xs">Размер: {formatFileSize(selectedBook.totalSize)}</p>
              )}
            </div>
            
            <button
              onClick={() => addBookmark(prompt('Добавить заметку к закладке:') || '')}
              className="p-1.5 sm:p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors flex-shrink-0"
            >
              <Bookmark className="text-white" size={14} />
            </button>
          </div>
        </div>

        {/* Улучшенный аудиоплеер */}
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
          {/* Обложка */}
          <div className="text-center mb-6 sm:mb-8">
            <div className={`w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 mb-3 sm:mb-4 relative overflow-hidden ${isPlaying ? 'animate-pulse' : ''}`}>
              <img 
                src={selectedBook.cover} 
                alt={selectedBook.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2">
                <div className="text-white text-xs sm:text-sm font-medium truncate">{chapter.title}</div>
                <div className="text-gray-300 text-xs">Глава {currentChapter + 1} из {selectedBook.chapters.length}</div>
              </div>
            </div>
          </div>

          {/* Аудио элемент */}
          <audio
            ref={audioRef}
            src={chapter.url}
            onTimeUpdate={(e) => {
              setCurrentTime(e.target.currentTime);
              updateReadingProgress();
            }}
            onDurationChange={(e) => setDuration(e.target.duration)}
            onEnded={() => changeChapter(1)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadStart={() => console.log('Загрузка аудио...')}
            onCanPlay={() => console.log('Аудио готово к воспроизведению')}
            onError={(e) => console.error('Ошибка загрузки аудио:', e)}
            preload="metadata"
          />

          {/* Улучшенный прогресс */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between text-xs sm:text-sm text-gray-300 mb-2">
              <span className="flex-shrink-0">{formatTime(currentTime)}</span>
              <span className="text-center truncate mx-2 hidden sm:inline">
                {chapter.title}
              </span>
              <span className="flex-shrink-0">{formatTime(duration)}</span>
            </div>
            <div 
              className="w-full bg-gray-700 rounded-full h-3 cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                seekTo(percent * duration);
              }}
            >
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 relative"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Красивое основное управление */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => seekTo(Math.max(0, currentTime - 15))}
              className="group relative p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-110"
              title="Назад на 15 сек"
            >
              <SkipBack size={18} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">-15с</span>
            </button>
            
            <button
              onClick={() => changeChapter(-1)}
              disabled={currentChapter === 0}
              className="group relative p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-110 disabled:hover:scale-100"
              title="Предыдущая глава"
            >
              <SkipBack size={16} className="group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={togglePlayback}
              className="group relative overflow-hidden p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-purple-500/40 animate-ping"></div>
              )}
            </button>
            
            <button
              onClick={() => changeChapter(1)}
              disabled={currentChapter >= selectedBook.chapters.length - 1}
              className="group relative p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-110 disabled:hover:scale-100"
              title="Следующая глава"
            >
              <SkipForward size={16} className="group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={() => seekTo(Math.min(duration, currentTime + 15))}
              className="group relative p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-110"
              title="Вперед на 15 сек"
            >
              <SkipForward size={18} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">+15с</span>
            </button>
          </div>

          {/* Расширенные настройки */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center">
            <div className="flex items-center gap-2">
              <Volume2 className="text-gray-300" size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = Number(e.target.value);
                  setVolume(newVolume);
                  if (audioRef.current) {
                    audioRef.current.volume = newVolume;
                  }
                }}
                className="w-24"
              />
              <span className="text-gray-300 text-sm">{Math.round(volume * 100)}%</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm">Скорость:</span>
              <select
                value={playbackRate}
                onChange={(e) => {
                  const rate = Number(e.target.value);
                  setPlaybackRate(rate);
                  if (audioRef.current) {
                    audioRef.current.playbackRate = rate;
                  }
                }}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="0.5" className="bg-gray-800">0.5x</option>
                <option value="0.75" className="bg-gray-800">0.75x</option>
                <option value="1" className="bg-gray-800">1x</option>
                <option value="1.25" className="bg-gray-800">1.25x</option>
                <option value="1.5" className="bg-gray-800">1.5x</option>
                <option value="2" className="bg-gray-800">2x</option>
              </select>
            </div>

            <div className="text-center">
              <div className="text-gray-300 text-sm">Качество:</div>
              <div className="text-white text-xs">
                {chapter.size ? formatFileSize(chapter.size) : 'Неизвестно'}
              </div>
            </div>
          </div>
        </div>

        {/* Список глав с дополнительной информацией */}
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6">
          <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Главы ({selectedBook.chapters.length})</h4>
          <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
            {selectedBook.chapters.map((ch, index) => (
              <button
                key={index}
                onClick={() => setCurrentChapter(index)}
                className={`w-full text-left p-2 sm:p-3 rounded-lg transition-colors touch-target ${
                  index === currentChapter
                    ? 'bg-purple-500/30 text-purple-100 border border-purple-500/50'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm sm:text-base truncate">{ch.title}</div>
                    <div className="text-xs opacity-75">
                      Глава {index + 1}
                      {ch.size && (
                        <span className="hidden sm:inline"> • {formatFileSize(ch.size)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {index === currentChapter && isPlaying && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-3 bg-green-400 rounded animate-pulse"></div>
                        <div className="w-1 h-2 bg-green-400 rounded animate-pulse delay-75"></div>
                        <div className="w-1 h-4 bg-green-400 rounded animate-pulse delay-150"></div>
                      </div>
                    )}
                    {ch.url.startsWith('blob:') ? (
                      <Upload className="text-blue-400" size={16} />
                    ) : (
                      <Link className="text-green-400" size={16} />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderImportExportModal = () => {
    if (!showImportExportModal) return null;

    const backupInfo = LibraryManager.generateBackupInfo(books, readingStats, bookmarks);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Download className="text-green-400" size={24} />
                Управление библиотекой
              </h3>
              <button
                onClick={() => setShowImportExportModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Прогресс операции */}
            {importExportProgress && (
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    {importExportProgress.status === 'exporting' ? 'Экспорт библиотеки' :
                     importExportProgress.status === 'importing' ? 'Импорт библиотеки' :
                     importExportProgress.status === 'completed' ? 'Операция завершена' :
                     'Ошибка операции'}
                  </span>
                  <div className="flex items-center gap-2">
                    {(importExportProgress.status === 'exporting' || importExportProgress.status === 'importing') && 
                     <Loader className="animate-spin text-blue-400" size={16} />}
                    {importExportProgress.status === 'completed' && <Check className="text-green-400" size={16} />}
                    {importExportProgress.status === 'error' && <AlertCircle className="text-red-400" size={16} />}
                    <span className="text-xs text-gray-300">{importExportProgress.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      importExportProgress.status === 'error' ? 'bg-red-500' :
                      importExportProgress.status === 'completed' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${importExportProgress.progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{importExportProgress.message}</div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Экспорт */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Upload className="text-blue-400" size={20} />
                  Экспорт библиотеки
                </h4>
                
                <div className="bg-white/5 rounded-xl p-4">
                  <h5 className="text-white font-medium mb-3">Текущая библиотека:</h5>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-300">{backupInfo.summary}</div>
                    {backupInfo.details.map((detail, index) => (
                      <div key={index} className="text-gray-400">{detail}</div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <h5 className="text-green-300 font-medium mb-2">Что будет экспортировано:</h5>
                  <ul className="text-green-200 text-sm space-y-1">
                    <li>• Все книги с полным текстом</li>
                    <li>• Метаданные (автор, название, описание)</li>
                    <li>• Ссылки на обложки и аудиофайлы</li>
                    <li>• Прогресс чтения по каждой книге</li>
                    <li>• Все закладки с заметками</li>
                    <li>• Достижения и статистика</li>
                    <li>• Настройки приложения</li>
                  </ul>
                </div>

                <button
                  onClick={handleExportLibrary}
                  disabled={books.length === 0 || importExportProgress?.status === 'exporting'}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Экспортировать библиотеку
                </button>

                {lastExportInfo && (
                  <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                    <div className="text-green-300 text-sm">
                      <div>✅ Последний экспорт: {lastExportInfo.fileName}</div>
                      <div>📚 Книг: {lastExportInfo.booksCount}</div>
                      <div>🔖 Закладок: {lastExportInfo.bookmarksCount}</div>
                      <div>📦 Размер: {(lastExportInfo.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Импорт */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Upload className="text-purple-400" size={20} />
                  Импорт библиотеки
                </h4>

                <div className="bg-white/5 rounded-xl p-4">
                  <h5 className="text-white font-medium mb-3">Стратегия импорта:</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importStrategy"
                        value="merge"
                        checked={importStrategy === 'merge'}
                        onChange={(e) => setImportStrategy(e.target.value)}
                        className="text-purple-500"
                      />
                      <div>
                        <div className="text-white text-sm">Объединить</div>
                        <div className="text-gray-400 text-xs">Добавить новые книги к существующим</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importStrategy"
                        value="replace"
                        checked={importStrategy === 'replace'}
                        onChange={(e) => setImportStrategy(e.target.value)}
                        className="text-purple-500"
                      />
                      <div>
                        <div className="text-white text-sm">Заменить</div>
                        <div className="text-gray-400 text-xs">Полностью заменить библиотеку</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="importStrategy"
                        value="keep-existing"
                        checked={importStrategy === 'keep-existing'}
                        onChange={(e) => setImportStrategy(e.target.value)}
                        className="text-purple-500"
                      />
                      <div>
                        <div className="text-white text-sm">Сохранить существующие</div>
                        <div className="text-gray-400 text-xs">Не изменять текущую библиотеку</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border-2 border-dashed border-purple-500/50 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                  <Upload className="mx-auto text-purple-400 mb-4" size={48} />
                  <p className="text-gray-300 text-sm mb-4">
                    Выберите файл экспорта библиотеки (.json)
                  </p>
                  <button
                    onClick={() => document.getElementById('library-import')?.click()}
                    disabled={importExportProgress?.status === 'importing'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Выбрать файл
                  </button>
                </div>

                <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                  <h5 className="text-orange-300 font-medium mb-2">⚠️ Внимание:</h5>
                  <ul className="text-orange-200 text-sm space-y-1">
                    <li>• Создайте резервную копию перед импортом</li>
                    <li>• Стратегия "Заменить" удалит текущие данные</li>
                    <li>• Импорт может занять время для больших библиотек</li>
                    <li>• Поддерживаются только файлы из этого приложения</li>
                  </ul>
                </div>
              </div>
            </div>

            <input
              id="library-import"
              type="file"
              accept=".json"
              onChange={handleImportLibrary}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderUploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {uploadType === 'file' ? 'Добавить книги' : 'Добавить аудиокнигу'}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {uploadType === 'file' ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 hover:border-purple-500 transition-colors">
                    <BookOpen className="mx-auto text-purple-400 mb-4" size={48} />
                    <h4 className="text-white font-semibold mb-2">Загрузите файлы книг</h4>
                    <p className="text-gray-300 text-sm mb-4">
                      Поддерживаемые форматы: FB2, TXT
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
                    >
                      Выбрать файлы
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h5 className="text-white font-medium mb-2">🚀 Возможности профессионального парсера:</h5>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• <strong>🧠 Интеллектуальное определение кодировки</strong> </li>
                    <li>• <strong>📊 Глубокое извлечение метаданных</strong> - автор, название, описание, жанры, ISBN, издательство, серии</li>
                    <li>• <strong>🔧 Многоуровневое разбиение на главы</strong> - семантический, структурный и размерный анализ</li>
                    <li>• <strong>🎯 Детекция жанров</strong> - эвристический анализ содержимого по ключевым словам</li>
                    <li>• <strong>📚 FB2 с полной поддержкой</strong> - секции, подсекции, переводчики, серии, аннотации</li>
                    <li>• <strong>🔬 Семантический анализ</strong> - определение структуры документа по содержанию</li>
                    <li>• <strong>✅ Система качества парсинга</strong> - анализ результата, рекомендации, оценка уверенности</li>
                    <li>• <strong>🛡️ Валидация и постобработка</strong> - проверка целостности, фильтрация ошибок</li>
                  </ul>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.fb2,.epub,.doc,.docx,.mobi,.pdf,.rtf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Загрузка файлов */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">📁 Загрузка файлов</h4>
                    
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Название книги</label>
                      <input
                        type="text"
                        value={audioBookTitle}
                        onChange={(e) => setAudioBookTitle(e.target.value)}
                        placeholder="Название аудиокниги"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Автор</label>
                      <input
                        type="text"
                        value={audioBookAuthor}
                        onChange={(e) => setAudioBookAuthor(e.target.value)}
                        placeholder="Автор"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>

                    <div className="border-2 border-dashed border-blue-500/50 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      <Headphones className="mx-auto text-blue-400 mb-4" size={48} />
                      <p className="text-gray-300 text-sm mb-4">
                        Поддерживаемые форматы: MP3, WAV, OGG, M4A
                      </p>
                      <button
                        onClick={() => document.getElementById('audio-upload')?.click()}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300"
                      >
                        Выбрать аудиофайлы
                      </button>
                    </div>
                  </div>

                  {/* Загрузка по URL */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">🔗 Загрузка по ссылкам</h4>
                    
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Название книги</label>
                      <input
                        type="text"
                        value={audioBookTitle}
                        onChange={(e) => setAudioBookTitle(e.target.value)}
                        placeholder="Название аудиокниги"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Автор</label>
                      <input
                        type="text"
                        value={audioBookAuthor}
                        onChange={(e) => setAudioBookAuthor(e.target.value)}
                        placeholder="Автор"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        MP3 ссылки (по одной на строку)
                      </label>
                      <textarea
                        value={audioUrls}
                        onChange={(e) => setAudioUrls(e.target.value)}
                        placeholder={`https://example.com/chapter1.mp3
https://example.com/chapter2.mp3
https://example.com/chapter3.mp3`}
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>

                    <button
                      onClick={handleAudioUrlsLoad}
                      disabled={!audioUrls.trim()}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Загрузить по ссылкам
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <h5 className="text-white font-medium mb-2">🎧 Возможности системы аудиокниг:</h5>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Массовая загрузка глав по MP3 ссылкам</li>
                    <li>• Автоматическая проверка доступности файлов</li>
                    <li>• Поддержка различных аудиоформатов</li>
                    <li>• Контроль скорости воспроизведения (0.5x - 2x)</li>
                    <li>• Закладки с привязкой ко времени</li>
                    <li>• Автоматическое переключение глав</li>
                  </ul>
                </div>

                <input
                  id="audio-upload"
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAIChat = () => (
    <div className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 max-w-sm bg-gray-900/95 sm:bg-white/10 sm:dark:bg-gray-900/50 backdrop-blur-lg border-l border-white/20 transform transition-transform duration-300 z-50 ${aiChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        {/* Заголовок чата */}
        <div className="p-3 sm:p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="text-white" size={14} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-white text-sm sm:text-base truncate">ИИ Помощник</h3>
                <p className="text-xs text-gray-400 truncate">Готов помочь с книгами</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={openApiKeyModal}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  aiAssistantRef.current?.apiKey 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                }`}
                title="Настройки API ключа"
              >
                <Settings size={14} />
              </button>
              <button
                onClick={toggleAITTS}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  localStorage.getItem('aiTtsEnabled') !== 'false'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}
                title={`${localStorage.getItem('aiTtsEnabled') !== 'false' ? 'Отключить' : 'Включить'} озвучку ответов`}
              >
                <Volume2 size={14} />
              </button>
              <button
                onClick={stopAIVoice}
                className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 transition-colors"
                title="Остановить озвучку"
              >
                <VolumeX size={14} />
              </button>
              <button
                onClick={() => setAiChatOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Расширенная статистика ИИ */}
        <div className="p-4 bg-white/5 border-b border-white/20">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>API статус:</span>
              <button
                onClick={openApiKeyModal}
                className={`font-medium transition-colors ${
                  aiAssistantRef.current?.apiKey ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'
                }`}
                title="Нажмите для настройки API ключа"
              >
                {aiAssistantRef.current?.apiKey ? 'Подключен' : 'Настроить'}
              </button>
            </div>
            <div className="flex justify-between">
              <span>Обучающих взаимодействий:</span>
              <span className="text-white font-medium">{aiAssistantRef.current?.getStatistics().totalInteractions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Сегодня:</span>
              <span className="text-white font-medium">{aiAssistantRef.current?.getStatistics().todayInteractions || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Точность ответов:</span>
              <span className="text-white font-medium">
                {Math.round((aiAssistantRef.current?.getStatistics().accuracy || 0) * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Автоозвучка:</span>
              <span className={`font-medium ${
                localStorage.getItem('aiTtsEnabled') !== 'false' ? 'text-green-400' : 'text-red-400'
              }`}>
                {localStorage.getItem('aiTtsEnabled') !== 'false' ? 'Включена' : 'Отключена'}
              </span>
            </div>
            {!aiAssistantRef.current?.apiKey && (
              <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-300 text-xs">
                <div className="flex items-center justify-between">
                  <span>⚠️ Для ИИ функций нужен API ключ</span>
                  <button
                    onClick={openApiKeyModal}
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 px-2 py-1 rounded text-yellow-200 transition-colors"
                  >
                    Настроить
                  </button>
                </div>
              </div>
            )}
            <div className="flex gap-1 flex-wrap">
              <span>Ключевые темы:</span>
              {aiAssistantRef.current?.getStatistics().topKeywords.slice(0, 3).map(([word]) => (
                <span key={word} className="px-1 py-0.5 bg-purple-500/20 rounded text-purple-300 text-xs">{word}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {aiMessages.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <Brain className="mx-auto mb-2" size={32} />
              <p>Привет! Я ваш умный помощник.</p>
              <p className="text-sm mt-1">Могу анализировать книги, давать рекомендации и отвечать на вопросы.</p>
              
              {!aiAssistantRef.current?.apiKey ? (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2 text-red-300">
                    <AlertCircle size={16} />
                    <span className="font-medium">Требуется API ключ</span>
                  </div>
                  <p className="text-red-200 text-sm mb-3">
                    Для работы ИИ необходим API ключ OpenRouter
                  </p>
                  <button
                    onClick={openApiKeyModal}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    🔑 Добавить API ключ
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={()=> setAiInput('Проанализируй мою библиотеку')}
                    className="block w-full text-left px-3 py-2 bg-purple-500/20 text-purple-300 text-sm rounded hover:bg-purple-500/30 transition-colors"
                  >
                    📊 Анализ библиотеки
                  </button>
                  <button
                    onClick={() => setAiInput('Что мне почитать дальше?')}
                    className="block w-full text-left px-3 py-2 bg-blue-500/20 text-blue-300 text-sm rounded hover:bg-blue-500/30 transition-colors"
                  >
                    📚 Рекомендации
                  </button>
                  <button
                    onClick={() => setAiInput('Покажи мою статистику чтения')}
                    className="block w-full text-left px-3 py-2 bg-green-500/20 text-green-300 text-sm rounded hover:bg-green-500/30 transition-colors"
                  >
                    📈 Статистика
                  </button>
                </div>
              )}
            </div>
          )}
          
          {aiMessages.map((message, index) => (
            <div
              key={message.timestamp || index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg relative ${
                message.type === 'user'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-100'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                
                {/* Индикатор воспроизведения и управление для ИИ сообщений */}
                {message.type === 'ai' && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      {message.isPlaying && (
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-3 bg-green-400 rounded animate-pulse"></div>
                          <div className="w-1 h-2 bg-green-400 rounded animate-pulse delay-75"></div>
                          <div className="w-1 h-4 bg-green-400 rounded animate-pulse delay-150"></div>
                          <span className="text-xs text-green-400 ml-1">Озвучивается...</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakAIResponse(message.content, message.id)}
                        disabled={message.isPlaying}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                        title="Озвучить сообщение"
                      >
                        <Volume2 size={12} />
                      </button>
                      
                      {message.isPlaying && (
                        <button
                          onClick={stopAIVoice}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Остановить озвучку"
                        >
                          <VolumeX size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {message.source && (
                  <div className="text-xs opacity-75 mt-1 flex items-center gap-1">
                    {message.source === 'learning' && <Brain size={12} />}
                    {message.source === 'book' && <BookOpen size={12} />}
                    {message.source === 'internet' && <Search size={12} />}
                    {message.source === 'analysis' && <TrendingUp size={12} />}
                    Источник: {
                      message.source === 'learning' ? 'обучение' : 
                      message.source === 'book' ? 'книга' : 
                      message.source === 'internet' ? 'интернет' : 
                      message.source === 'analysis' ? 'анализ' :
                      'система'
                    }
                  </div>
                )}
                
                {message.confidence && (
                  <div className="text-xs opacity-75 mt-1">
                    Уверенность: {Math.round(message.confidence * 100)}%
                  </div>
                )}
                
                {message.suggestions && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs opacity-75">Попробуйте спросить:</div>
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setAiInput(suggestion)}
                        className="block text-xs text-left w-full px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                
                {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs opacity-75">Похожие вопросы:</div>
                    {message.relatedQuestions.map((question, i) => (
                      <button
                        key={i}
                        onClick={() => setAiInput(question)}
                        className="block text-xs text-left w-full px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <RefreshCw size={16} />
                  </div>
                  <span className="text-sm">Анализирую и думаю...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Улучшенный ввод сообщения */}
        <div className="p-3 sm:p-4 border-t border-white/20">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAIMessage()}
              placeholder={aiAssistantRef.current?.apiKey ? "Задайте вопрос..." : "Сначала добавьте API ключ"}
              disabled={!aiAssistantRef.current?.apiKey}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleAIMessage}
              disabled={!aiInput.trim() || aiLoading || !aiAssistantRef.current?.apiKey}
              className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
          
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {aiAssistantRef.current?.apiKey ? (
              <>
                <button
                  onClick={() => setAiInput('Проанализируй содержание моих книг')}
                  className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded hover:bg-white/10 transition-colors"
                >
                  Анализ
                </button>
                <button
                  onClick={() => setAiInput('Порекомендуй что почитать')}
                  className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded hover:bg-white/10 transition-colors"
                >
                  Рекомендации
                </button>
                <button
                  onClick={() => setAiInput('Покажи статистику')}
                  className="px-2 py-1 bg-white/5 text-gray-300 text-xs rounded hover:bg-white/10 transition-colors"
                >
                  Статистика
                </button>
              </>
            ) : (
              <button
                onClick={openApiKeyModal}
                className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded hover:bg-red-500/30 transition-colors font-medium"
              >
                🔑 Настроить API ключ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Модальное окно для настройки API ключа
  const renderApiKeyModal = () => {
    if (!showApiKeyModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-purple-400" size={24} />
                Настройка API ключа
              </h3>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  OpenRouter API ключ
                </label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <div className="mt-2 text-xs text-gray-400">
                  Ключ сохраняется локально в браузере и не передается третьим лицам
                </div>
              </div>

              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <h4 className="text-blue-300 font-medium mb-2">🔑 Как получить API ключ:</h4>
                <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
                  <li>Перейдите на <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline">openrouter.ai</a></li>
                  <li>Зарегистрируйтесь или войдите в аккаунт</li>
                  <li>Перейдите в раздел "API Keys"</li>
                  <li>Создайте новый ключ</li>
                  <li>Скопируйте и вставьте его сюда</li>
                </ol>
              </div>

              <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                <h4 className="text-yellow-300 font-medium mb-2">💡 Информация:</h4>
                <ul className="text-yellow-200 text-sm space-y-1">
                  <li>• Используется модель: <code className="bg-black/20 px-1 rounded">qwen/qwq-32b:free</code></li>
                  <li>• Бесплатные модели доступны без оплаты</li>
                  <li>• Ключ хранится только в вашем браузере</li>
                  <li>• Можно удалить в любое время</li>
                </ul>
              </div>

              {aiAssistantRef.current?.apiKey && (
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="text-green-400" size={16} />
                    <span className="text-green-300 font-medium">API ключ активен</span>
                  </div>
                  <div className="text-green-200 text-sm">
                    Ключ: •••••••••••{aiAssistantRef.current.apiKey.slice(-8)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              {aiAssistantRef.current?.apiKey && (
                <button
                  onClick={handleRemoveApiKey}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded-lg transition-colors font-medium"
                >
                  🗑️ Удалить ключ
                </button>
              )}
              
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 py-2 rounded-lg transition-colors"
              >
                Отмена
              </button>
              
              <button
                onClick={handleSaveApiKey}
                disabled={!tempApiKey.trim()}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                💾 Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Остальные модальные окна остаются без изменений
  const renderEditModal = () => {
    if (!showEditModal || !editingBook) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Редактирование книги</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Основная информация */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Название</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({...editingBook, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Автор</label>
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) => setEditingBook({...editingBook, author: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Описание</label>
                <textarea
                  value={editingBook.description || ''}
                  onChange={(e) => setEditingBook({...editingBook, description: e.target.value})}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Ссылка на обложку</label>
                <input
                  type="url"
                  value={editingBook.cover}
                  onChange={(e) => setEditingBook({...editingBook, cover: e.target.value})}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                {editingBook.cover && (
                  <div className="mt-2 flex items-center gap-2">
                    <img 
                      src={editingBook.cover} 
                      alt="Предварительный просмотр"
                      className="w-16 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => setEditingBook({...editingBook, cover: ''})}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Очистить
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Главы */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Главы книги</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {editingBook.chapters?.map((chapter, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">Глава {index + 1}</span>
                      <button
                        onClick={() => {
                          const newChapters = editingBook.chapters.filter((_, i) => i !== index);
                          setEditingBook({...editingBook, chapters: newChapters});
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => {
                          const newChapters = [...editingBook.chapters];
                          newChapters[index] = {...chapter, title: e.target.value};
                          setEditingBook({...editingBook, chapters: newChapters});
                        }}
                        placeholder="Название главы"
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      
                      {editingBook.type === 'text' ? (
                        <textarea
                          value={chapter.content}
                          onChange={(e) => {
                            const newChapters = [...editingBook.chapters];
                            newChapters[index] = {...chapter, content: e.target.value};
                            setEditingBook({...editingBook, chapters: newChapters});
                          }}
                          placeholder="Содержание главы"
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      ) : (
                        <input
                          type="url"
                          value={chapter.url}
                          onChange={(e) => {
                            const newChapters = [...editingBook.chapters];
                            newChapters[index] = {...chapter, url: e.target.value};
                            setEditingBook({...editingBook, chapters: newChapters});
                          }}
                          placeholder="URL аудиофайла"
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      )}
                      
                      {editingBook.type === 'text' && (
                        <div className="text-xs text-gray-400">
                          Символов: {chapter.content?.length || 0}
                        </div>
                      )}
                      
                      {editingBook.type === 'audio' && chapter.size && (
                        <div className="text-xs text-gray-400">
                          Размер: {formatFileSize(chapter.size)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newChapter = editingBook.type === 'text' 
                      ? { title: `Глава ${editingBook.chapters.length + 1}`, content: '' }
                      : { title: `Глава ${editingBook.chapters.length + 1}`, url: '', size: 0 };
                    
                    setEditingBook({
                      ...editingBook, 
                      chapters: [...(editingBook.chapters || []), newChapter]
                    });
                  }}
                  className="w-full p-3 border-2 border-dashed border-purple-500/50 text-purple-300 rounded-lg hover:border-purple-500 hover:text-purple-200 transition-colors"
                >
                  + Добавить главу
                </button>
              </div>
            </div>

            {/* Действия */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setBooks(prev => prev.filter(b => b.id !== editingBook.id));
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Удалить книгу
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    setBooks(prev => prev.map(b => b.id === editingBook.id ? editingBook : b));
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  💾 Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStatsModal = () => {
    if (!showStatsModal) return null;

    const stats = calculateStats();
    const insights = recommendationEngineRef.current?.getReadingInsights(books, readingStats) || [];
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-green-400" size={24} />
                Статистика чтения
              </h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="text-purple-400" size={24} />
                  <h4 className="text-purple-300 font-semibold">Библиотека</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalBooks}</div>
                <div className="text-sm text-gray-300">Всего книг</div>
                <div className="text-xs text-purple-300 mt-2">
                  {stats.booksInProgress} в процессе, {stats.completedBooks} завершено
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="text-green-400" size={24} />
                  <h4 className="text-green-300 font-semibold">Прогресс</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.round((stats.completedBooks / Math.max(stats.totalBooks, 1)) * 100)}%
                </div>
                <div className="text-sm text-gray-300">Завершенных книг</div>
                <div className="text-xs text-green-300 mt-2">
                  {stats.completedBooks} из {stats.totalBooks}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Bookmark className="text-blue-400" size={24} />
                  <h4 className="text-blue-300 font-semibold">Закладки</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.totalBookmarks}</div>
                <div className="text-sm text-gray-300">Сохранено моментов</div>
                <div className="text-xs text-blue-300 mt-2">
                  В {Object.keys(bookmarks).length} книгах
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="text-yellow-400" size={24} />
                  <h4 className="text-yellow-300 font-semibold">Активность</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stats.readingStreak}</div>
                <div className="text-sm text-gray-300">Дней подряд</div>
                <div className="text-xs text-yellow-300 mt-2">
                  Этот месяц: {stats.booksThisMonth} книг
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="text-indigo-400" size={24} />
                  <h4 className="text-indigo-300 font-semibold">Объем</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.round(stats.totalWords / 1000)}K
                </div>
                <div className="text-sm text-gray-300">Слов прочитано</div>
                <div className="text-xs text-indigo-300 mt-2">
                  ≈ {Math.round(stats.totalWords / 200)} минут чтения
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl p-6 border border-red-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-red-400" size={24} />
                  <h4 className="text-red-300 font-semibold">Достижения</h4>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {Object.values(achievements).filter(Boolean).length}
                </div>
                <div className="text-sm text-gray-300">Разблокировано</div>
                <div className="text-xs text-red-300 mt-2">
                  из {Object.keys(achievements).length} доступных
                </div>
              </div>
            </div>

            {/* Инсайты и рекомендации */}
            {insights.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="text-purple-400" size={20} />
                  Анализ ваших предпочтений
                </h4>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* График прогресса по месяцам */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4">История чтения</h4>
              <div className="space-y-4">
                {books.slice(0, 10).map(book => {
                  const bookStats = readingStats[book.id] || {};
                  const progress = bookStats.progress || 0;
                  const lastRead = bookStats.lastRead ? new Date(bookStats.lastRead).toLocaleDateString() : 'Не читал';
                  
                  return (
                    <div key={book.id} className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="text-white font-medium text-sm">{book.title}</div>
                        <div className="text-gray-400 text-xs">{book.author} • {lastRead}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-white text-sm font-medium">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAchievementsModal = () => {
    if (!showAchievementsModal) return null;

    const achievementsList = [
      {
        id: 'collector',
        name: 'Коллекционер',
        description: 'Добавьте 10 книг в библиотеку',
        icon: BookOpen,
        color: 'text-blue-400',
        unlocked: achievements.collector
      },
      {
        id: 'reader',
        name: 'Читатель',
        description: 'Прочитайте 5 книг полностью',
        icon: Trophy,
        color: 'text-gold-400',
        unlocked: achievements.reader
      },
      {
        id: 'bookmarker',
        name: 'Закладочник',
        description: 'Создайте 50 закладок',
        icon: Bookmark,
        color: 'text-yellow-400',
        unlocked: achievements.bookmarker
      },
      {
        id: 'active',
        name: 'Активный читатель',
        description: 'Читайте 3 книги в месяц',
        icon: Zap,
        color: 'text-orange-400',
        unlocked: achievements.active
      },
      {
        id: 'wordMaster',
        name: 'Мастер слова',
        description: 'Прочитайте 100,000 слов',
        icon: Target,
        color: 'text-purple-400',
        unlocked: achievements.wordMaster
      },
      {
        id: 'consistent',
        name: 'Постоянство',
        description: 'Читайте 7 дней подряд',
        icon: Medal,
        color: 'text-green-400',
        unlocked: achievements.consistent
      }
    ];

    const unlockedCount = achievementsList.filter(a => a.unlocked).length;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="text-yellow-400" size={24} />
                Достижения
              </h3>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Прогресс достижений</span>
                <span className="text-gray-300">{unlockedCount}/{achievementsList.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(unlockedCount / achievementsList.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {achievementsList.map(achievement => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-6 border transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        achievement.unlocked
                          ? 'bg-yellow-500/20'
                          : 'bg-gray-700/50'
                      }`}>
                        <Icon 
                          className={achievement.unlocked ? achievement.color : 'text-gray-500'} 
                          size={24} 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${
                            achievement.unlocked ? 'text-white' : 'text-gray-400'
                          }`}>
                            {achievement.name}
                          </h4>
                          {achievement.unlocked && (
                            <Crown className="text-yellow-400" size={16} />
                          )}
                        </div>
                        <p className={`text-sm ${
                          achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        {achievement.unlocked && (
                          <div className="text-xs text-yellow-400 mt-1 font-medium">
                            ✨ Разблокировано!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {unlockedCount === achievementsList.length && (
              <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30 text-center">
                <Crown className="mx-auto text-yellow-400 mb-2" size={32} />
                <h4 className="text-xl font-bold text-white mb-1">Поздравляем!</h4>
                <p className="text-yellow-300">Вы разблокировали все достижения!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBookmarksModal = () => {
    if (!showBookmarksModal) return null;

    const allBookmarks = Object.entries(bookmarks).flatMap(([bookId, bookmarkList]) => 
      bookmarkList.map(bookmark => ({
        ...bookmark,
        book: books.find(b => b.id === bookId)
      }))
    ).sort((a, b) => b.timestamp - a.timestamp);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Bookmark className="text-yellow-400" size={24} />
                Закладки ({allBookmarks.length})
              </h3>
              <button
                onClick={() => setShowBookmarksModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {allBookmarks.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="mx-auto text-gray-400 mb-4" size={64} />
                <h4 className="text-xl font-semibold text-gray-300 mb-2">Нет закладок</h4>
                <p className="text-gray-400">Создайте первую закладку во время чтения</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allBookmarks.map(bookmark => (
                  <div
                    key={bookmark.id}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => goToBookmark(bookmark)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium">{bookmark.book?.title || 'Неизвестная книга'}</h4>
                        <p className="text-gray-300 text-sm">{bookmark.book?.author || 'Неизвестный автор'}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(bookmark.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        {bookmark.type === 'audio' ? (
                          <>
                            <Headphones size={16} />
                            <span>Глава {bookmark.chapterIndex + 1}</span>
                            {bookmark.audioTime && (
                              <span>• {formatTime(bookmark.audioTime)}</span>
                            )}
                          </>
                        ) : (
                          <>
                            <BookOpen size={16} />
                            <span>Глава {bookmark.chapterIndex + 1}</span>
                            {bookmark.sentenceIndex && (
                              <span>• Предложение {bookmark.sentenceIndex + 1}</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {bookmark.note && (
                      <div className="bg-white/5 rounded p-3 text-sm text-gray-200">
                        "{bookmark.note}"
                      </div>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookmarks(prev => ({
                          ...prev,
                          [bookmark.bookId]: prev[bookmark.bookId].filter(b => b.id !== bookmark.id)
                        }));
                      }}
                      className="mt-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                    >
                      Удалить закладку
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Мобильная навигация */}
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Логотип и название */}
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
              <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="text-white" size={12} />
              </div>
              <span className="text-xs sm:text-sm lg:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                BookReader Pro
              </span>
            </div>
            
            {/* Текущая книга - только на больших экранах */}
            {selectedBook && (
              <div className="hidden xl:flex items-center gap-2 mx-4 min-w-0">
                <button
                  onClick={() => setCurrentView(selectedBook.type === 'audio' ? 'audio' : 'reader')}
                  className={`px-3 py-1.5 rounded-lg transition-colors text-sm whitespace-nowrap ${
                    (currentView === 'reader' || currentView === 'audio') 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {selectedBook.type === 'audio' ? '🎧 Аудиоплеер' : '📖 Читалка'}
                </button>
              </div>
            )}

            {/* Основные действия */}
            <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-2 flex-shrink-0">
              {/* Домой - всегда видимо */}
              <button
                onClick={() => setCurrentView('library')}
                className={`p-1 sm:p-1.5 lg:p-2 transition-colors touch-target ${
                  currentView === 'library' 
                    ? 'text-purple-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Библиотека"
              >
                <BookOpen size={14} className="sm:hidden" />
                <BookOpen size={16} className="hidden sm:block lg:hidden" />
                <BookOpen size={20} className="hidden lg:block" />
              </button>
              
              {/* Закладки - всегда видимо */}
              <button
                onClick={() => setShowBookmarksModal(true)}
                className="p-1 sm:p-1.5 lg:p-2 text-gray-400 hover:text-white transition-colors relative touch-target"
                title="Закладки"
              >
                <Bookmark size={14} className="sm:hidden" />
                <Bookmark size={16} className="hidden sm:block lg:hidden" />
                <Bookmark size={20} className="hidden lg:block" />
                {Object.values(bookmarks).flat().length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {Object.values(bookmarks).flat().length > 99 ? '99+' : Object.values(bookmarks).flat().length}
                  </div>
                )}
              </button>
              
              {/* ИИ Помощник - всегда видимо */}
              <button
                onClick={() => setAiChatOpen(!aiChatOpen)}
                className={`p-1 sm:p-1.5 lg:p-2 transition-colors touch-target ${
                  aiChatOpen ? 'text-purple-400' : 'text-gray-400 hover:text-white'
                }`}
                title="ИИ Помощник"
              >
                <Brain size={14} className="sm:hidden" />
                <Brain size={16} className="hidden sm:block lg:hidden" />
                <Brain size={20} className="hidden lg:block" />
              </button>
              
              {/* Статистика - только на больших экранах */}
              <button
                onClick={() => setShowStatsModal(true)}
                className="hidden md:block p-1 sm:p-1.5 lg:p-2 text-gray-400 hover:text-white transition-colors touch-target"
                title="Статистика"
              >
                <TrendingUp size={16} className="lg:hidden" />
                <TrendingUp size={20} className="hidden lg:block" />
              </button>
              
              {/* Достижения - только на больших экранах */}
              <button
                onClick={() => setShowAchievementsModal(true)}
                className="hidden md:block p-1 sm:p-1.5 lg:p-2 text-gray-400 hover:text-white transition-colors touch-target"
                title="Достижения"
              >
                <Award size={16} className="lg:hidden" />
                <Award size={20} className="hidden lg:block" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {currentView === 'library' && renderLibrary()}
        {currentView === 'reader' && renderReader()}
        {currentView === 'audio' && renderAudioPlayer()}
      </main>

      {/* ИИ Чат - адаптивный */}
      {renderAIChat()}

      {/* Модальные окна */}
      {renderUploadModal()}
      {renderImportExportModal()}
      {renderApiKeyModal()}
      {renderEditModal()}
      {renderStatsModal()}
      {renderAchievementsModal()}
      {renderBookmarksModal()}
    </div>
  );
};

export default LiquidGlassLibrary;
