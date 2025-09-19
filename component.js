// <stdin>
import React, { useState, useEffect, useRef, useCallback } from "https://esm.sh/react@18.2.0";
import { Search, Plus, BookOpen, Headphones, Settings, Moon, Sun, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Star, Trophy, Bookmark, Edit3, Trash2, Download, MessageCircle, Brain, Sparkles, FileText, AudioLines, RefreshCw, ChevronDown, ChevronUp, User, Send, Mic, MicOff, X, Check, AlertCircle, Book, Heart, TrendingUp, Filter, Tag, Calendar, Award, Zap, Crown, Medal, Target, Activity, Link, Upload, Loader } from "https://esm.sh/lucide-react?deps=react@18.2.0,react-dom@18.2.0";
var { useStoredState } = hatch;
var AdvancedFileParser = class {
  static async parseFile(file, onProgress) {
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    try {
      onProgress?.({
        status: "analyzing",
        progress: 0,
        message: `\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E \u0444\u0430\u0439\u043B ${fileName} (${this.formatFileSize(fileSize)})...`
      });
      if (fileSize > 50 * 1024 * 1024) {
        throw new Error("\u0424\u0430\u0439\u043B \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439 (\u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 50MB)");
      }
      const fileType = this.detectFileType(fileName, file);
      onProgress?.({
        status: "parsing",
        progress: 5,
        message: `\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E ${fileType.toUpperCase()} \u0444\u0430\u0439\u043B...`
      });
      let result;
      switch (fileType) {
        case "epub":
          result = await this.parseEPUB(file, onProgress);
          break;
        case "fb2":
          result = await this.parseFB2(file, onProgress);
          break;
        case "txt":
          result = await this.parseTXT(file, onProgress);
          break;
        case "docx":
          result = await this.parseDOCX(file, onProgress);
          break;
        case "doc":
          result = await this.parseDOC(file, onProgress);
          break;
        case "mobi":
          result = await this.parseMOBI(file, onProgress);
          break;
        case "pdf":
          result = await this.parsePDF(file, onProgress);
          break;
        case "rtf":
          result = await this.parseRTF(file, onProgress);
          break;
        default:
          throw new Error(`\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0444\u0430\u0439\u043B\u0430: ${fileType}`);
      }
      result = await this.postProcessResult(result, onProgress);
      onProgress?.({
        status: "completed",
        progress: 100,
        message: `\u041F\u0430\u0440\u0441\u0438\u043D\u0433 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D! \u0418\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u043E ${result.chapters?.length || 0} \u0433\u043B\u0430\u0432`
      });
      return result;
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430:", error);
      onProgress?.({
        status: "error",
        progress: 0,
        message: `\u041E\u0448\u0438\u0431\u043A\u0430: ${error.message}`
      });
      throw error;
    }
  }
  static detectFileType(fileName, file) {
    if (fileName.endsWith(".epub")) return "epub";
    if (fileName.endsWith(".fb2")) return "fb2";
    if (fileName.endsWith(".txt")) return "txt";
    if (fileName.endsWith(".docx")) return "docx";
    if (fileName.endsWith(".doc")) return "doc";
    if (fileName.endsWith(".mobi")) return "mobi";
    if (fileName.endsWith(".pdf")) return "pdf";
    if (fileName.endsWith(".rtf")) return "rtf";
    const mimeType = file.type;
    if (mimeType === "application/epub+zip") return "epub";
    if (mimeType === "application/x-fictionbook+xml") return "fb2";
    if (mimeType === "text/plain") return "txt";
    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
    if (mimeType === "application/msword") return "doc";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType === "application/rtf") return "rtf";
    const ext = fileName.split(".").pop().toLowerCase();
    const supportedTypes = ["epub", "fb2", "txt", "docx", "doc", "mobi", "pdf", "rtf"];
    if (supportedTypes.includes(ext)) {
      return ext;
    }
    throw new Error("\u041D\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u043D\u044B\u0439 \u0442\u0438\u043F \u0444\u0430\u0439\u043B\u0430");
  }
  static formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
  static async postProcessResult(result, onProgress) {
    onProgress?.({
      status: "processing",
      progress: 95,
      message: "\u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u0438 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u044F..."
    });
    if (!result.title) {
      result.title = "\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F";
    }
    if (!result.author) {
      result.author = "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440";
    }
    if (!result.chapters || result.chapters.length === 0) {
      throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u0437\u0432\u043B\u0435\u0447\u044C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u043A\u043D\u0438\u0433\u0438");
    }
    result.title = this.cleanText(result.title);
    result.author = this.cleanText(result.author);
    result.description = this.cleanText(result.description || "");
    result.chapters = result.chapters.map((chapter, index) => ({
      ...chapter,
      title: this.cleanText(chapter.title || `\u0413\u043B\u0430\u0432\u0430 ${index + 1}`),
      content: this.cleanText(chapter.content || ""),
      index,
      wordCount: this.countWords(chapter.content || ""),
      estimatedReadingTime: this.estimateReadingTime(chapter.content || "")
    })).filter((chapter) => chapter.content.length > 50);
    result.parsedDate = (/* @__PURE__ */ new Date()).toISOString();
    result.totalWordCount = result.chapters.reduce((sum, ch) => sum + ch.wordCount, 0);
    result.totalEstimatedTime = this.estimateReadingTime(
      result.chapters.map((ch) => ch.content).join(" ")
    );
    result.detectedGenres = this.detectGenres(result);
    return result;
  }
  static detectGenres(bookData) {
    const text = (bookData.title + " " + bookData.description + " " + bookData.chapters.slice(0, 3).map((ch) => ch.content.substring(0, 1e3)).join(" ")).toLowerCase();
    const genreKeywords = {
      "\u0444\u0430\u043D\u0442\u0430\u0441\u0442\u0438\u043A\u0430": ["\u043A\u043E\u0441\u043C\u043E\u0441", "\u0440\u043E\u0431\u043E\u0442", "\u0430\u043D\u0434\u0440\u043E\u0438\u0434", "\u043F\u043B\u0430\u043D\u0435\u0442\u0430", "\u0433\u0430\u043B\u0430\u043A\u0442\u0438\u043A\u0430", "\u0431\u0443\u0434\u0443\u0449\u0435\u0435", "\u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u044F"],
      "\u0444\u044D\u043D\u0442\u0435\u0437\u0438": ["\u043C\u0430\u0433\u0438\u044F", "\u044D\u043B\u044C\u0444", "\u0434\u0440\u0430\u043A\u043E\u043D", "\u0437\u0430\u043A\u043B\u0438\u043D\u0430\u043D\u0438\u0435", "\u0432\u043E\u043B\u0448\u0435\u0431\u043D\u0438\u043A", "\u043A\u043E\u0440\u043E\u043B\u0435\u0432\u0441\u0442\u0432\u043E", "\u043C\u0435\u0447"],
      "\u0434\u0435\u0442\u0435\u043A\u0442\u0438\u0432": ["\u0443\u0431\u0438\u0439\u0441\u0442\u0432\u043E", "\u0440\u0430\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435", "\u0434\u0435\u0442\u0435\u043A\u0442\u0438\u0432", "\u043F\u0440\u0435\u0441\u0442\u0443\u043F\u043B\u0435\u043D\u0438\u0435", "\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u0442\u0435\u043B\u044C", "\u0443\u043B\u0438\u043A\u0430"],
      "\u0440\u043E\u043C\u0430\u043D": ["\u043B\u044E\u0431\u043E\u0432\u044C", "\u0441\u0435\u0440\u0434\u0446\u0435", "\u0447\u0443\u0432\u0441\u0442\u0432\u0430", "\u0440\u043E\u043C\u0430\u043D\u0442\u0438\u043A\u0430", "\u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u044F", "\u0441\u0432\u0430\u0434\u044C\u0431\u0430"],
      "\u0442\u0440\u0438\u043B\u043B\u0435\u0440": ["\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C", "\u043F\u043E\u0433\u043E\u043D\u044F", "\u0443\u0433\u0440\u043E\u0437\u0430", "\u043D\u0430\u043F\u0440\u044F\u0436\u0435\u043D\u0438\u0435", "\u0432\u044B\u0436\u0438\u0432\u0430\u043D\u0438\u0435", "\u0441\u0442\u0440\u0430\u0445"],
      "\u0438\u0441\u0442\u043E\u0440\u0438\u044F": ["\u0432\u0435\u043A", "\u0432\u043E\u0439\u043D\u0430", "\u0438\u043C\u043F\u0435\u0440\u0438\u044F", "\u043A\u043E\u0440\u043E\u043B\u044C", "\u0431\u0438\u0442\u0432\u0430", "\u0438\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u0438\u0439"],
      "\u0431\u0438\u043E\u0433\u0440\u0430\u0444\u0438\u044F": ["\u0440\u043E\u0434\u0438\u043B\u0441\u044F", "\u0436\u0438\u0437\u043D\u044C", "\u0441\u0443\u0434\u044C\u0431\u0430", "\u0431\u0438\u043E\u0433\u0440\u0430\u0444\u0438\u044F", "\u043C\u0435\u043C\u0443\u0430\u0440\u044B", "\u0430\u0432\u0442\u043E\u0431\u0438\u043E\u0433\u0440\u0430\u0444\u0438\u044F"],
      "\u043D\u0430\u0443\u0447\u043F\u043E\u043F": ["\u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u0435", "\u0442\u0435\u043E\u0440\u0438\u044F", "\u043D\u0430\u0443\u0447\u043D\u044B\u0439", "\u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0435", "\u044D\u043A\u0441\u043F\u0435\u0440\u0438\u043C\u0435\u043D\u0442", "\u043D\u0430\u0443\u043A\u0430"]
    };
    const detectedGenres = [];
    Object.entries(genreKeywords).forEach(([genre, keywords]) => {
      const score = keywords.reduce((sum, keyword) => {
        const regex = new RegExp(keyword, "gi");
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
    onProgress?.({ status: "parsing", progress: 10, message: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E EPUB \u0430\u0440\u0445\u0438\u0432..." });
    try {
      const arrayBuffer = await file.arrayBuffer();
      onProgress?.({ status: "parsing", progress: 25, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443 EPUB..." });
      const uint8Array = new Uint8Array(arrayBuffer);
      let extractedText = "";
      try {
        extractedText = new TextDecoder("utf-8", { fatal: false }).decode(uint8Array);
      } catch (e) {
        try {
          extractedText = new TextDecoder("windows-1251", { fatal: false }).decode(uint8Array);
        } catch (e2) {
          extractedText = new TextDecoder("iso-8859-1", { fatal: false }).decode(uint8Array);
        }
      }
      onProgress?.({ status: "parsing", progress: 50, message: "\u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435..." });
      const metadata = this.extractEPUBMetadata(extractedText);
      onProgress?.({ status: "parsing", progress: 70, message: "\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0433\u043B\u0430\u0432..." });
      const cleanText = this.extractAndCleanEPUBContent(extractedText);
      onProgress?.({ status: "parsing", progress: 85, message: "\u0420\u0430\u0437\u0431\u0438\u0432\u0430\u044E \u043D\u0430 \u0433\u043B\u0430\u0432\u044B..." });
      const chapters = this.intelligentChapterSplit(cleanText);
      if (chapters.length === 0) {
        throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u0437\u0432\u043B\u0435\u0447\u044C \u0433\u043B\u0430\u0432\u044B \u0438\u0437 EPUB \u0444\u0430\u0439\u043B\u0430");
      }
      return {
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
        author: metadata.author || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
        description: metadata.description || "",
        language: metadata.language || this.detectLanguage(cleanText),
        subject: metadata.subject || [],
        publisher: metadata.publisher || "",
        date: metadata.date || "",
        identifier: metadata.identifier || "",
        chapters,
        format: "EPUB",
        originalSize: file.size
      };
    } catch (error) {
      throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 EPUB: ${error.message}`);
    }
  }
  static extractEPUBMetadata(content) {
    const metadata = {};
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
        if (key === "subject") {
          metadata[key] = matches.map((m) => this.cleanText(m[1])).filter(Boolean);
        } else {
          metadata[key] = this.cleanText(matches[0][1]);
        }
      }
    });
    const metaPattern = /<meta\s+name="([^"]+)"\s+content="([^"]+)"/gi;
    const metaMatches = [...content.matchAll(metaPattern)];
    metaMatches.forEach((match) => {
      const name = match[1].toLowerCase();
      const content2 = this.cleanText(match[2]);
      if (name.includes("author") && !metadata.author) {
        metadata.author = content2;
      } else if (name.includes("description") && !metadata.description) {
        metadata.description = content2;
      }
    });
    return metadata;
  }
  static extractAndCleanEPUBContent(content) {
    content = content.replace(/PK\x03\x04.*?(?=<)/g, "");
    const htmlMatches = content.match(/<html[^>]*>[\s\S]*?<\/html>/gi) || [];
    const bodyMatches = content.match(/<body[^>]*>[\s\S]*?<\/body>/gi) || [];
    let extractedText = "";
    [...htmlMatches, ...bodyMatches].forEach((htmlBlock) => {
      let cleanBlock = htmlBlock.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "").replace(/<\/?(h[1-6]|p|div|br|hr)[^>]*>/gi, "\n\n").replace(/<[^>]+>/g, " ").replace(/&([a-zA-Z0-9#]+);/g, (match, entity) => this.decodeHTMLEntity(entity)).replace(/\s+/g, " ").trim();
      if (cleanBlock.length > 100) {
        extractedText += cleanBlock + "\n\n";
      }
    });
    if (extractedText.length < 500) {
      const allText = content.replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, " ").replace(/\s+/g, " ").trim();
      if (allText.length > extractedText.length) {
        extractedText = allText;
      }
    }
    return extractedText;
  }
  static decodeHTMLEntity(entity) {
    const entities = {
      "amp": "&",
      "lt": "<",
      "gt": ">",
      "quot": '"',
      "apos": "'",
      "nbsp": " ",
      "mdash": "\u2014",
      "ndash": "\u2013",
      "hellip": "\u2026",
      "laquo": "\xAB",
      "raquo": "\xBB",
      "copy": "\xA9",
      "reg": "\xAE",
      "trade": "\u2122",
      "deg": "\xB0",
      "plusmn": "\xB1",
      "frac12": "\xBD"
    };
    if (entities[entity]) {
      return entities[entity];
    }
    if (entity.startsWith("#")) {
      const code = entity.startsWith("#x") ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      if (!isNaN(code) && code > 0 && code < 1114112) {
        return String.fromCharCode(code);
      }
    }
    return " ";
  }
  // Профессиональный парсинг FB2
  static async parseFB2(file, onProgress) {
    onProgress?.({ status: "parsing", progress: 15, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E FB2 \u0444\u0430\u0439\u043B..." });
    const arrayBuffer = await file.arrayBuffer();
    let text = "";
    let detectedEncoding = "utf-8";
    const encodings = [
      "utf-8",
      "utf-16le",
      "utf-16be",
      "windows-1251",
      "koi8-r",
      "iso-8859-5",
      "cp866"
    ];
    let bestScore = -1;
    let bestText = "";
    onProgress?.({ status: "parsing", progress: 25, message: "\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u044E \u043E\u043F\u0442\u0438\u043C\u0430\u043B\u044C\u043D\u0443\u044E \u043A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0443..." });
    for (const encoding of encodings) {
      try {
        const decoder = new TextDecoder(encoding, { fatal: true });
        const candidateText = decoder.decode(arrayBuffer);
        if (candidateText.includes("<?xml") && candidateText.includes("<FictionBook")) {
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
    if (!text || !text.includes("<FictionBook")) {
      throw new Error("\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 FB2 \u0444\u0430\u0439\u043B \u0438\u043B\u0438 \u043D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u0430\u044F \u043A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0430");
    }
    onProgress?.({ status: "parsing", progress: 40, message: `\u041A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0430: ${detectedEncoding}. \u041F\u0430\u0440\u0441\u0438\u043D\u0433 XML...` });
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");
    const parseError = xmlDoc.querySelector("parsererror");
    if (parseError) {
      throw new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 FB2 XML: " + parseError.textContent);
    }
    onProgress?.({ status: "parsing", progress: 55, message: "\u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435..." });
    const metadata = this.extractFB2Metadata(xmlDoc);
    onProgress?.({ status: "parsing", progress: 70, message: "\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443 \u043A\u043D\u0438\u0433\u0438..." });
    const chapters = this.extractFB2Content(xmlDoc);
    if (chapters.length === 0) {
      throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u0437\u0432\u043B\u0435\u0447\u044C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0438\u0437 FB2 \u0444\u0430\u0439\u043B\u0430");
    }
    onProgress?.({ status: "parsing", progress: 90, message: "\u0424\u0438\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443..." });
    const fullText = chapters.map((ch) => ch.content).join(" ");
    return {
      title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      author: metadata.authors.join(", ") || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
      description: metadata.annotation || "",
      chapters,
      genres: metadata.genres,
      language: metadata.language || "ru",
      date: metadata.date || "",
      translator: metadata.translators.join(", "),
      publisher: metadata.publisher || "",
      series: metadata.series || "",
      sequence: metadata.sequence || "",
      isbn: metadata.isbn || "",
      encoding: detectedEncoding,
      format: "FB2",
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
    const titleInfo = xmlDoc.querySelector("title-info");
    const publishInfo = xmlDoc.querySelector("publish-info");
    const documentInfo = xmlDoc.querySelector("document-info");
    if (titleInfo) {
      metadata.title = this.extractFB2Text(titleInfo, "book-title");
      const authors = titleInfo.querySelectorAll("author");
      authors.forEach((author) => {
        const first = this.extractFB2Text(author, "first-name") || "";
        const middle = this.extractFB2Text(author, "middle-name") || "";
        const last = this.extractFB2Text(author, "last-name") || "";
        const nickname = this.extractFB2Text(author, "nickname") || "";
        const fullName = [first, middle, last].filter(Boolean).join(" ") || nickname;
        if (fullName) {
          metadata.authors.push(fullName);
        }
      });
      const translators = titleInfo.querySelectorAll("translator");
      translators.forEach((translator) => {
        const first = this.extractFB2Text(translator, "first-name") || "";
        const middle = this.extractFB2Text(translator, "middle-name") || "";
        const last = this.extractFB2Text(translator, "last-name") || "";
        const fullName = [first, middle, last].filter(Boolean).join(" ");
        if (fullName) {
          metadata.translators.push(fullName);
        }
      });
      const genres = titleInfo.querySelectorAll("genre");
      metadata.genres = Array.from(genres).map((g) => g.textContent?.trim()).filter(Boolean);
      const annotation = titleInfo.querySelector("annotation");
      if (annotation) {
        metadata.annotation = this.extractTextFromElement(annotation);
      }
      const keywords = titleInfo.querySelectorAll("keywords");
      metadata.keywords = Array.from(keywords).map((k) => k.textContent?.trim()).filter(Boolean);
      metadata.language = this.extractFB2Text(titleInfo, "lang") || "ru";
      metadata.date = this.extractFB2Text(titleInfo, "date");
      const sequence = titleInfo.querySelector("sequence");
      if (sequence) {
        metadata.series = sequence.getAttribute("name") || "";
        metadata.sequence = sequence.getAttribute("number") || "";
      }
    }
    if (publishInfo) {
      metadata.publisher = this.extractFB2Text(publishInfo, "publisher");
      metadata.isbn = this.extractFB2Text(publishInfo, "isbn");
      if (!metadata.date) {
        metadata.date = this.extractFB2Text(publishInfo, "year");
      }
    }
    return metadata;
  }
  static extractFB2Content(xmlDoc) {
    const chapters = [];
    const mainBody = xmlDoc.querySelector("body:not([name])");
    if (mainBody) {
      const sections = mainBody.querySelectorAll("section");
      if (sections.length > 0) {
        sections.forEach((section, index) => {
          const chapter = this.processFB2Section(section, index);
          if (chapter && chapter.content.length > 100) {
            chapters.push(chapter);
          }
        });
      } else {
        const content = this.extractTextFromElement(mainBody);
        if (content && content.length > 100) {
          chapters.push({
            title: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0442\u0435\u043A\u0441\u0442",
            content: this.cleanText(content),
            index: 0
          });
        }
      }
    }
    if (chapters.length === 0) {
      const allBodies = xmlDoc.querySelectorAll("body");
      allBodies.forEach((body, bodyIndex) => {
        const content = this.extractTextFromElement(body);
        if (content && content.length > 100) {
          chapters.push({
            title: `\u0427\u0430\u0441\u0442\u044C ${bodyIndex + 1}`,
            content: this.cleanText(content),
            index: bodyIndex
          });
        }
      });
    }
    return chapters;
  }
  static processFB2Section(section, index) {
    let title = this.extractSectionTitle(section);
    if (!title) {
      title = `\u0413\u043B\u0430\u0432\u0430 ${index + 1}`;
    }
    let content = "";
    const subsections = section.querySelectorAll("section");
    if (subsections.length > 0) {
      subsections.forEach((subsection, subIndex) => {
        const subTitle = this.extractSectionTitle(subsection);
        const subContent = this.extractSectionContent(subsection);
        if (subTitle && subTitle !== title) {
          content += `

${subTitle}

`;
        }
        if (subContent) {
          content += subContent + "\n\n";
        }
      });
    } else {
      content = this.extractSectionContent(section);
    }
    return {
      title: this.cleanText(title),
      content: this.cleanText(content),
      index
    };
  }
  static extractTextFromElement(element) {
    if (!element) return "";
    const clone = element.cloneNode(true);
    const serviceTags = ["title", "epigraph", "annotation"];
    serviceTags.forEach((tag) => {
      const elements = clone.querySelectorAll(tag);
      elements.forEach((el) => el.remove());
    });
    const blockTags = ["p", "v", "stanza", "cite", "subtitle", "empty-line"];
    blockTags.forEach((tag) => {
      const elements = clone.querySelectorAll(tag);
      elements.forEach((el) => {
        el.innerHTML = "\n\n" + el.innerHTML + "\n\n";
      });
    });
    return clone.textContent || "";
  }
  // Профессиональный парсинг TXT
  static async parseTXT(file, onProgress) {
    onProgress?.({ status: "parsing", progress: 10, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0444\u0430\u0439\u043B..." });
    const arrayBuffer = await file.arrayBuffer();
    let text = "";
    let detectedEncoding = "utf-8";
    const encodings = [
      "utf-8",
      "utf-16le",
      "utf-16be",
      "windows-1251",
      "windows-1252",
      "koi8-r",
      "koi8-u",
      "iso-8859-1",
      "iso-8859-5",
      "iso-8859-15",
      "cp866",
      "cp1251"
    ];
    onProgress?.({ status: "parsing", progress: 25, message: "\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u044E \u043A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0443 \u0441 \u0430\u043D\u0430\u043B\u0438\u0437\u043E\u043C BOM..." });
    const uint8Array = new Uint8Array(arrayBuffer);
    if (uint8Array.length >= 3) {
      if (uint8Array[0] === 239 && uint8Array[1] === 187 && uint8Array[2] === 191) {
        text = new TextDecoder("utf-8").decode(arrayBuffer.slice(3));
        detectedEncoding = "utf-8";
      } else if (uint8Array[0] === 255 && uint8Array[1] === 254) {
        text = new TextDecoder("utf-16le").decode(arrayBuffer.slice(2));
        detectedEncoding = "utf-16le";
      } else if (uint8Array[0] === 254 && uint8Array[1] === 255) {
        text = new TextDecoder("utf-16be").decode(arrayBuffer.slice(2));
        detectedEncoding = "utf-16be";
      }
    }
    if (!text) {
      let bestScore = -1;
      let bestText = "";
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
      throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u0435\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0444\u0430\u0439\u043B");
    }
    onProgress?.({ status: "parsing", progress: 45, message: `\u041A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0430: ${detectedEncoding}. \u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435...` });
    const metadata = this.extractTXTMetadata(text, file.name);
    onProgress?.({ status: "parsing", progress: 65, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430..." });
    const cleanedText = this.preprocessText(text);
    onProgress?.({ status: "parsing", progress: 80, message: "\u0418\u043D\u0442\u0435\u043B\u043B\u0435\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u043E\u0435 \u0440\u0430\u0437\u0431\u0438\u0435\u043D\u0438\u0435 \u043D\u0430 \u0433\u043B\u0430\u0432\u044B..." });
    const chapters = this.intelligentChapterSplitAdvanced(cleanedText);
    if (chapters.length === 0) {
      throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u0437\u0432\u043B\u0435\u0447\u044C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0438\u0437 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0430");
    }
    return {
      title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
      author: metadata.author || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
      description: metadata.description || "",
      chapters,
      encoding: detectedEncoding,
      language: metadata.language || this.detectLanguage(text),
      originalFormat: metadata.format || "Plain Text",
      originalSize: file.size,
      format: "TXT"
    };
  }
  static calculateTextQualityAdvanced(text) {
    if (!text || text.length < 50) return 0;
    let score = 0;
    const readableChars = text.match(/[a-zA-Zа-яёА-ЯЁ0-9\s.,!?;:'"()\-]/g) || [];
    const readableRatio = readableChars.length / text.length;
    score += readableRatio * 0.4;
    const russianChars = text.match(/[а-яёА-ЯЁ]/g) || [];
    const englishChars = text.match(/[a-zA-Z]/g) || [];
    const totalLetters = russianChars.length + englishChars.length;
    if (totalLetters > 0) {
      const russianRatio = russianChars.length / totalLetters;
      const englishRatio = englishChars.length / totalLetters;
      if (russianRatio > 0.7) score += 0.3;
      else if (englishRatio > 0.7) score += 0.2;
      else if (russianRatio > 0.3 && englishRatio > 0.3) score += 0.1;
    }
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    if (sentences.length > 0) {
      const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
      if (avgSentenceLength > 20 && avgSentenceLength < 200) score += 0.2;
    }
    if (text.match(/(.)\1{10,}/)) score -= 0.3;
    if (text.match(/[^\x20-\x7E\u00A0-\uFFFF]{10,}/)) score -= 0.2;
    return Math.max(0, Math.min(1, score));
  }
  static extractTXTMetadata(text, fileName) {
    const metadata = {};
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (line.length > 5 && line.length < 150) {
        const isTitle = i < 3 && // В первых трех строках
        !line.includes(".") && // Не содержит точек
        line.length > 10 && // Достаточно длинная
        line.match(/[A-ZА-Я]/) && // Содержит заглавные буквы
        !line.match(/^(глава|chapter|часть|part)\s+\d/i);
        if (isTitle && !metadata.title) {
          metadata.title = line;
        }
      }
    }
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
    if (text.includes("<?xml") || text.includes("<html>")) {
      metadata.format = "XML/HTML Text";
    } else if (text.includes("\\documentclass") || text.includes("\\begin{document}")) {
      metadata.format = "LaTeX Document";
    } else if (text.match(/^#{1,6}\s/m)) {
      metadata.format = "Markdown Document";
    } else {
      metadata.format = "Plain Text";
    }
    return metadata;
  }
  static preprocessText(text) {
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    text = text.replace(/[ \t]+/g, " ");
    text = text.replace(/\n{4,}/g, "\n\n\n");
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
    return text.trim();
  }
  static intelligentChapterSplitAdvanced(text) {
    const chapters = [];
    const chapterPatterns = [
      // Русские паттерны
      {
        pattern: /^(ГЛАВА|Глава|глава)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: "numbered"
      },
      {
        pattern: /^(ЧАСТЬ|Часть|часть)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: "numbered"
      },
      {
        pattern: /^(РАЗДЕЛ|Раздел|раздел)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: "numbered"
      },
      // Английские паттерны
      {
        pattern: /^(CHAPTER|Chapter|chapter)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: "numbered"
      },
      {
        pattern: /^(PART|Part|part)\s*(\d+|[IVXLCDM]+)([.\s]|$)/gm,
        type: "numbered"
      },
      // Специальные паттерны
      {
        pattern: /^(\d+)\.\s*([А-ЯЁA-Z])/gm,
        type: "numbered"
      },
      {
        pattern: /^\*{3,}\s*([А-ЯЁA-Z].*?)\s*\*{3,}$/gm,
        type: "decorated"
      },
      {
        pattern: /^={3,}\s*([А-ЯЁA-Z].*?)\s*={3,}$/gm,
        type: "decorated"
      },
      {
        pattern: /^-{3,}\s*([А-ЯЁA-Z].*?)\s*-{3,}$/gm,
        type: "decorated"
      }
    ];
    let bestSplit = null;
    let maxChapters = 0;
    let bestType = null;
    for (const { pattern, type } of chapterPatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > maxChapters && matches.length > 1) {
        maxChapters = matches.length;
        bestSplit = matches;
        bestType = type;
      }
    }
    if (bestSplit && bestSplit.length > 1) {
      for (let i = 0; i < bestSplit.length; i++) {
        const start = bestSplit[i].index;
        const end = i + 1 < bestSplit.length ? bestSplit[i + 1].index : text.length;
        const chapterText = text.slice(start, end).trim();
        if (chapterText.length > 200) {
          const lines = chapterText.split("\n");
          const title = this.extractChapterTitle(lines[0], bestType) || `\u0413\u043B\u0430\u0432\u0430 ${i + 1}`;
          const content = lines.slice(1).join("\n").trim() || chapterText;
          chapters.push({
            title: this.cleanText(title),
            content: this.cleanText(content),
            index: i,
            type: bestType
          });
        }
      }
    }
    if (chapters.length === 0) {
      const semanticChapters = this.semanticChapterSplit(text);
      chapters.push(...semanticChapters);
    }
    if (chapters.length === 0) {
      const sizeBasedChapters = this.sizeBasedChapterSplit(text);
      chapters.push(...sizeBasedChapters);
    }
    return chapters.filter((ch) => ch.content.length > 100);
  }
  static extractChapterTitle(titleLine, type) {
    if (type === "numbered") {
      return titleLine.replace(/^(ГЛАВА|Глава|глава|CHAPTER|Chapter|chapter|ЧАСТЬ|Часть|часть|PART|Part|part|РАЗДЕЛ|Раздел|раздел)\s*/i, "");
    }
    if (type === "decorated") {
      return titleLine.replace(/^[*=-]{3,}\s*|\s*[*=-]{3,}$/g, "");
    }
    return titleLine;
  }
  static semanticChapterSplit(text) {
    const chapters = [];
    const paragraphs = text.split(/\n\s*\n/);
    if (paragraphs.length < 10) {
      return [];
    }
    let currentChapter = [];
    let chapterIndex = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i].trim();
      if (paragraph.length < 50) continue;
      const isNewChapter = currentChapter.length > 5 && // Минимум 5 параграфов в главе
      (paragraph.match(/^[А-ЯЁA-Z].*[.!?]$/m) || // Заглавная буква + точка
      paragraph.length < 200 && currentChapter.length > 10);
      if (isNewChapter && currentChapter.length > 0) {
        const chapterText = currentChapter.join("\n\n");
        if (chapterText.length > 500) {
          chapters.push({
            title: `\u0427\u0430\u0441\u0442\u044C ${chapterIndex + 1}`,
            content: this.cleanText(chapterText),
            index: chapterIndex,
            type: "semantic"
          });
          chapterIndex++;
        }
        currentChapter = [];
      }
      currentChapter.push(paragraph);
    }
    if (currentChapter.length > 0) {
      const chapterText = currentChapter.join("\n\n");
      if (chapterText.length > 500) {
        chapters.push({
          title: `\u0427\u0430\u0441\u0442\u044C ${chapterIndex + 1}`,
          content: this.cleanText(chapterText),
          index: chapterIndex,
          type: "semantic"
        });
      }
    }
    return chapters;
  }
  static sizeBasedChapterSplit(text) {
    const chapters = [];
    const words = text.split(/\s+/);
    const totalWords = words.length;
    if (totalWords < 1e3) {
      return [{
        title: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0442\u0435\u043A\u0441\u0442",
        content: this.cleanText(text),
        index: 0,
        type: "single"
      }];
    }
    const targetChapters = Math.min(20, Math.max(3, Math.floor(totalWords / 2e3)));
    const wordsPerChapter = Math.floor(totalWords / targetChapters);
    let currentChapter = [];
    let chapterIndex = 0;
    for (let i = 0; i < words.length; i++) {
      currentChapter.push(words[i]);
      if (currentChapter.length >= wordsPerChapter || i === words.length - 1) {
        for (let j = i; j < Math.min(i + 100, words.length); j++) {
          if (words[j].match(/[.!?]$/)) {
            while (i < j) {
              i++;
              if (i < words.length) {
                currentChapter.push(words[i]);
              }
            }
            break;
          }
        }
        const chapterText = currentChapter.join(" ").trim();
        if (chapterText.length > 200) {
          chapters.push({
            title: `\u0427\u0430\u0441\u0442\u044C ${chapterIndex + 1}`,
            content: this.cleanText(chapterText),
            index: chapterIndex,
            type: "size-based"
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
    onProgress?.({ status: "parsing", progress: 15, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E DOCX \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443..." });
    try {
      const arrayBuffer = await file.arrayBuffer();
      onProgress?.({ status: "parsing", progress: 30, message: "\u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0438\u0437 ZIP \u0430\u0440\u0445\u0438\u0432\u0430..." });
      const uint8Array = new Uint8Array(arrayBuffer);
      let documentXML = "";
      let coreProperties = "";
      const textContent = new TextDecoder("utf-8", { fatal: false }).decode(uint8Array);
      const documentMatch = textContent.match(/document\.xml[\s\S]*?<\/w:document>/);
      if (documentMatch) {
        documentXML = documentMatch[0];
      }
      const coreMatch = textContent.match(/core\.xml[\s\S]*?<\/cp:coreProperties>/);
      if (coreMatch) {
        coreProperties = coreMatch[0];
      }
      onProgress?.({ status: "parsing", progress: 50, message: "\u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430..." });
      const metadata = this.extractDOCXMetadata(coreProperties, textContent);
      onProgress?.({ status: "parsing", progress: 70, message: "\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435..." });
      let extractedText = "";
      if (documentXML) {
        extractedText = this.extractTextFromWordXML(documentXML);
      }
      if (!extractedText || extractedText.length < 100) {
        const textMatches = textContent.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
        extractedText = textMatches.map((match) => {
          const content = match.replace(/<[^>]*>/g, "");
          return this.decodeHTMLEntity(content);
        }).join(" ");
      }
      if (!extractedText || extractedText.length < 100) {
        const allText = textContent.replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, " ").replace(/\s+/g, " ").trim();
        const sentences = allText.split(/[.!?]+/).filter((s) => s.trim().length > 20);
        extractedText = sentences.join(". ");
      }
      if (!extractedText || extractedText.length < 50) {
        throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u0437\u0432\u043B\u0435\u0447\u044C \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0438\u0437 DOCX \u0444\u0430\u0439\u043B\u0430");
      }
      onProgress?.({ status: "parsing", progress: 85, message: "\u0420\u0430\u0437\u0431\u0438\u0432\u0430\u044E \u043D\u0430 \u0433\u043B\u0430\u0432\u044B..." });
      const cleanedText = this.cleanText(extractedText);
      const chapters = this.intelligentChapterSplitAdvanced(cleanedText);
      if (chapters.length === 0) {
        chapters.push({
          title: "\u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442",
          content: cleanedText,
          index: 0
        });
      }
      return {
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
        author: metadata.author || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
        description: metadata.description || metadata.subject || "",
        chapters,
        language: metadata.language || this.detectLanguage(cleanedText),
        creator: metadata.creator || "",
        lastModifiedBy: metadata.lastModifiedBy || "",
        created: metadata.created || "",
        modified: metadata.modified || "",
        format: "DOCX",
        originalSize: file.size
      };
    } catch (error) {
      throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 DOCX: ${error.message}`);
    }
  }
  static extractDOCXMetadata(coreProperties, fullContent) {
    const metadata = {};
    if (coreProperties) {
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
    let cleanXML = documentXML.replace(/<w:instrText[^>]*>[\s\S]*?<\/w:instrText>/g, "").replace(/<w:fldChar[^>]*>/g, "").replace(/<w:endnoteReference[^>]*\/>/g, "").replace(/<w:footnoteReference[^>]*\/>/g, "").replace(/<w:commentRangeStart[^>]*\/>/g, "").replace(/<w:commentRangeEnd[^>]*\/>/g, "").replace(/<w:commentReference[^>]*\/>/g, "");
    const paragraphMatches = cleanXML.match(/<w:p[^>]*>[\s\S]*?<\/w:p>/g) || [];
    let extractedText = "";
    paragraphMatches.forEach((paragraph) => {
      const textNodes = paragraph.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
      let paragraphText = "";
      textNodes.forEach((textNode) => {
        const content = textNode.replace(/<[^>]*>/g, "");
        paragraphText += content;
      });
      if (paragraphText.trim()) {
        extractedText += paragraphText + "\n\n";
      }
    });
    if (!extractedText || extractedText.length < 100) {
      const allTextNodes = cleanXML.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
      extractedText = allTextNodes.map((node) => node.replace(/<[^>]*>/g, "")).join(" ");
    }
    return extractedText.trim();
  }
  // Улучшенный парсинг DOC
  static async parseDOC(file, onProgress) {
    onProgress?.({ status: "parsing", progress: 20, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E DOC \u0444\u0430\u0439\u043B..." });
    const arrayBuffer = await file.arrayBuffer();
    const view = new DataView(arrayBuffer);
    let text = "";
    for (let i = 0; i < arrayBuffer.byteLength - 1; i++) {
      const byte = view.getUint8(i);
      if (byte >= 32 && byte <= 126) {
        text += String.fromCharCode(byte);
      } else if (byte === 0) {
        text += " ";
      }
    }
    text = text.replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, " ").replace(/\s+/g, " ").trim();
    onProgress?.({ status: "parsing", progress: 80, message: "\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435..." });
    const result = this.processTextContent(text, file.name);
    onProgress?.({ status: "parsing", progress: 100, message: "DOC \u043F\u0430\u0440\u0441\u0438\u043D\u0433 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D!" });
    return result;
  }
  // Улучшенный парсинг MOBI
  static async parseMOBI(file, onProgress) {
    onProgress?.({ status: "parsing", progress: 20, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E MOBI \u0444\u0430\u0439\u043B..." });
    const arrayBuffer = await file.arrayBuffer();
    const view = new DataView(arrayBuffer);
    const mobiHeader = new TextDecoder("ascii").decode(arrayBuffer.slice(60, 68));
    if (mobiHeader !== "BOOKMOBI") {
      throw new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 MOBI \u0444\u0430\u0439\u043B\u0430");
    }
    onProgress?.({ status: "parsing", progress: 50, message: "\u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435..." });
    let title = file.name.replace(/\.[^/.]+$/, "");
    let author = "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440";
    let text = "";
    for (let i = 0; i < arrayBuffer.byteLength - 1; i++) {
      const byte = view.getUint8(i);
      if (byte >= 32 && byte <= 126) {
        text += String.fromCharCode(byte);
      } else if (byte === 0) {
        text += " ";
      }
    }
    text = text.replace(/BOOKMOBI|EXTH|MOBI|PDB/g, "").replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, " ").replace(/\s+/g, " ").trim();
    onProgress?.({ status: "parsing", progress: 80, message: "\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435..." });
    const result = this.processTextContent(text, file.name);
    onProgress?.({ status: "parsing", progress: 100, message: "MOBI \u043F\u0430\u0440\u0441\u0438\u043D\u0433 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D!" });
    return result;
  }
  // Профессиональный парсинг PDF с улучшенным извлечением
  static async parsePDF(file, onProgress) {
    onProgress?.({ status: "parsing", progress: 10, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E PDF \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443..." });
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      onProgress?.({ status: "parsing", progress: 25, message: "\u0418\u0449\u0443 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0435 \u043F\u043E\u0442\u043E\u043A\u0438..." });
      let extractedText = "";
      const pdfText = new TextDecoder("latin1").decode(uint8Array);
      const textObjectMatches = pdfText.match(/BT\s*[\s\S]*?ET/g) || [];
      const streamMatches = pdfText.match(/stream[\s\S]*?endstream/g) || [];
      onProgress?.({ status: "parsing", progress: 50, message: "\u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u0442\u0435\u043A\u0441\u0442 \u0438\u0437 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432..." });
      textObjectMatches.forEach((textObj) => {
        const textCommands = textObj.match(/\([^)]*\)\s*Tj|\[[^\]]*\]\s*TJ/g) || [];
        textCommands.forEach((cmd) => {
          const textMatch = cmd.match(/\(([^)]*)\)|\[([^\]]*)\]/);
          if (textMatch) {
            const text = textMatch[1] || textMatch[2];
            if (text) {
              extractedText += this.decodePDFText(text) + " ";
            }
          }
        });
      });
      streamMatches.forEach((stream) => {
        const content = stream.replace(/^stream\s*|\s*endstream$/g, "");
        try {
          const decoded = this.decodePDFStream(content);
          if (decoded && decoded.length > 10) {
            extractedText += decoded + " ";
          }
        } catch (e) {
        }
      });
      onProgress?.({ status: "parsing", progress: 70, message: "\u041E\u0447\u0438\u0449\u0430\u044E \u0438 \u043D\u043E\u0440\u043C\u0430\u043B\u0438\u0437\u0443\u044E \u0442\u0435\u043A\u0441\u0442..." });
      extractedText = extractedText.replace(/\\[0-9]{3}/g, " ").replace(/\\[nrtbf]/g, " ").replace(/\s+/g, " ").trim();
      if (extractedText.length < 100) {
        extractedText = this.extractPDFTextFallback(uint8Array);
      }
      onProgress?.({ status: "parsing", progress: 85, message: "\u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435..." });
      const metadata = this.extractPDFMetadata(pdfText);
      onProgress?.({ status: "parsing", progress: 95, message: "\u0420\u0430\u0437\u0431\u0438\u0432\u0430\u044E \u043D\u0430 \u0433\u043B\u0430\u0432\u044B..." });
      const chapters = this.intelligentChapterSplitAdvanced(extractedText);
      if (chapters.length === 0) {
        throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u0437\u0432\u043B\u0435\u0447\u044C \u0447\u0438\u0442\u0430\u0435\u043C\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u0438\u0437 PDF \u0444\u0430\u0439\u043B\u0430");
      }
      return {
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
        author: metadata.author || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
        description: metadata.subject || metadata.keywords || "",
        chapters,
        creator: metadata.creator || "",
        producer: metadata.producer || "",
        creationDate: metadata.creationDate || "",
        language: this.detectLanguage(extractedText),
        format: "PDF",
        originalSize: file.size,
        pdfVersion: metadata.version || ""
      };
    } catch (error) {
      throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 PDF: ${error.message}`);
    }
  }
  static decodePDFText(text) {
    return text.replace(/\\([0-7]{3})/g, (match, octal) => {
      const charCode = parseInt(octal, 8);
      return String.fromCharCode(charCode);
    }).replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "	").replace(/\\b/g, "\b").replace(/\\f/g, "\f").replace(/\\\\/g, "\\").replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\(/g, "(").replace(/\\\)/g, ")");
  }
  static decodePDFStream(content) {
    const cleanContent = content.replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, " ").replace(/\s+/g, " ").trim();
    return cleanContent.length > 50 ? cleanContent : "";
  }
  static extractPDFTextFallback(uint8Array) {
    let text = "";
    let inTextObject = false;
    const pdfString = new TextDecoder("latin1", { fatal: false }).decode(uint8Array);
    const readableChunks = pdfString.match(/[\x20-\x7E\u00A0-\uFFFF]{10,}/g) || [];
    readableChunks.forEach((chunk) => {
      if (!chunk.match(/^(obj|endobj|stream|endstream|xref|trailer|%%PDF|startxref)/) && chunk.length > 20 && chunk.match(/[a-zA-Zа-яА-Я]/)) {
        text += chunk + " ";
      }
    });
    return text.replace(/\s+/g, " ").trim();
  }
  static extractPDFMetadata(pdfContent) {
    const metadata = {};
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
    const versionMatch = pdfContent.match(/%PDF-([0-9.]+)/);
    if (versionMatch) {
      metadata.version = versionMatch[1];
    }
    return metadata;
  }
  // Профессиональный парсинг RTF с улучшенной очисткой
  static async parseRTF(file, onProgress) {
    onProgress?.({ status: "parsing", progress: 15, message: "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E RTF \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443..." });
    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = "";
      const encodings = ["utf-8", "windows-1251", "windows-1252", "iso-8859-1"];
      for (const encoding of encodings) {
        try {
          const decoder = new TextDecoder(encoding, { fatal: true });
          text = decoder.decode(arrayBuffer);
          if (text.includes("{\\rtf")) break;
        } catch (e) {
          continue;
        }
      }
      if (!text.includes("{\\rtf")) {
        throw new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 RTF \u0444\u0430\u0439\u043B\u0430");
      }
      onProgress?.({ status: "parsing", progress: 30, message: "\u0418\u0437\u0432\u043B\u0435\u043A\u0430\u044E \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435 RTF..." });
      const metadata = this.extractRTFMetadata(text);
      onProgress?.({ status: "parsing", progress: 50, message: "\u041E\u0447\u0438\u0449\u0430\u044E RTF \u0440\u0430\u0437\u043C\u0435\u0442\u043A\u0443..." });
      let cleanText = this.cleanRTFAdvanced(text);
      onProgress?.({ status: "parsing", progress: 70, message: "\u041D\u043E\u0440\u043C\u0430\u043B\u0438\u0437\u0443\u044E \u0442\u0435\u043A\u0441\u0442..." });
      cleanText = this.preprocessText(cleanText);
      onProgress?.({ status: "parsing", progress: 85, message: "\u0420\u0430\u0437\u0431\u0438\u0432\u0430\u044E \u043D\u0430 \u0433\u043B\u0430\u0432\u044B..." });
      const chapters = this.intelligentChapterSplitAdvanced(cleanText);
      if (chapters.length === 0) {
        throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u0437\u0432\u043B\u0435\u0447\u044C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0438\u0437 RTF \u0444\u0430\u0439\u043B\u0430");
      }
      return {
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
        author: metadata.author || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
        description: metadata.subject || metadata.keywords || "",
        chapters,
        category: metadata.category || "",
        company: metadata.company || "",
        manager: metadata.manager || "",
        keywords: metadata.keywords || "",
        language: this.detectLanguage(cleanText),
        format: "RTF",
        originalSize: file.size
      };
    } catch (error) {
      throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 RTF: ${error.message}`);
    }
  }
  static extractRTFMetadata(rtfContent) {
    const metadata = {};
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
    text = text.replace(/\{\\rtf[^}]*\}/, "");
    text = text.replace(/\{\\fonttbl[^}]*\}/g, "");
    text = text.replace(/\{\\colortbl[^}]*\}/g, "");
    text = text.replace(/\{\\stylesheet[^}]*\}/g, "");
    text = text.replace(/\{\\info[^}]*\}/g, "");
    text = text.replace(/\\u(\d+)\??/g, (match, code) => {
      const charCode = parseInt(code);
      return charCode > 0 ? String.fromCharCode(charCode) : "";
    });
    const rtfReplacements = {
      "\\par": "\n\n",
      "\\line": "\n",
      "\\tab": "	",
      "\\lquote": "'",
      "\\rquote": "'",
      "\\ldblquote": '"',
      "\\rdblquote": '"',
      "\\endash": "\u2013",
      "\\emdash": "\u2014",
      "\\bullet": "\u2022",
      "\\ ": " ",
      // Неразрывный пробел
      "\\~": " "
      // Неразрывный пробел
    };
    Object.entries(rtfReplacements).forEach(([rtfCmd, replacement]) => {
      text = text.replace(new RegExp(rtfCmd.replace(/[\\]/g, "\\\\"), "g"), replacement);
    });
    text = text.replace(/\\[a-z]+\d*\s?/gi, "");
    text = text.replace(/\{([^{}]*)\}/g, "$1");
    text = text.replace(/\\(.)/g, "$1");
    text = text.replace(/\s+/g, " ").trim();
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
    if (result.chapters && result.chapters.length > 0) {
      quality.score += 25;
      if (result.chapters.length > 50) {
        quality.issues.push("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u0433\u043B\u0430\u0432 - \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u043D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0435 \u0440\u0430\u0437\u0431\u0438\u0435\u043D\u0438\u0435");
        quality.recommendations.push("\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0440\u0430\u0437\u0431\u0438\u0435\u043D\u0438\u044F \u043D\u0430 \u0433\u043B\u0430\u0432\u044B");
      } else if (result.chapters.length === 1 && result.chapters[0].content.length > 5e4) {
        quality.issues.push("\u041A\u043D\u0438\u0433\u0430 \u043D\u0435 \u0440\u0430\u0437\u0431\u0438\u0442\u0430 \u043D\u0430 \u0433\u043B\u0430\u0432\u044B");
        quality.recommendations.push("\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0434\u0440\u0443\u0433\u043E\u0439 \u043C\u0435\u0442\u043E\u0434 \u0440\u0430\u0437\u0431\u0438\u0435\u043D\u0438\u044F");
      }
    } else {
      quality.issues.push("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0438\u0437\u0432\u043B\u0435\u0447\u044C \u0433\u043B\u0430\u0432\u044B");
    }
    if (result.title && result.title !== "\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F") {
      quality.score += 15;
    } else {
      quality.issues.push("\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438");
    }
    if (result.author && result.author !== "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440") {
      quality.score += 15;
    } else {
      quality.issues.push("\u041D\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D \u0430\u0432\u0442\u043E\u0440");
    }
    if (result.description && result.description.length > 10) {
      quality.score += 10;
    }
    const totalContent = result.chapters?.reduce((sum, ch) => sum + (ch.content?.length || 0), 0) || 0;
    if (totalContent > 1e3) {
      quality.score += 25;
    } else {
      quality.issues.push("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u043E \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u043E\u0433\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E");
    }
    if (result.language && result.language !== "unknown") {
      quality.score += 10;
    }
    quality.confidence = Math.min(100, quality.score) / 100;
    if (quality.score < 50) {
      quality.recommendations.push("\u0420\u0430\u0441\u0441\u043C\u043E\u0442\u0440\u0438\u0442\u0435 \u0440\u0443\u0447\u043D\u0443\u044E \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0444\u0430\u0439\u043B\u0430");
    } else if (quality.score < 75) {
      quality.recommendations.push("\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0438 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442");
    }
    return quality;
  }
  // Расширенная система определения языка
  static detectLanguageAdvanced(text) {
    if (!text || text.length < 100) return "unknown";
    const sample = text.substring(0, 5e3).toLowerCase();
    const languagePatterns = {
      "ru": {
        chars: /[а-яё]/g,
        words: /\b(в|и|на|с|по|для|не|от|за|к|до|из|о|у|а|но|что|как|это|то|так|если|да|нет|или|еще|все|при|про|под|над|между|через|без|после|перед)\b/g,
        weight: 1
      },
      "en": {
        chars: /[a-z]/g,
        words: /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|up|about|into|through|during|before|after|above|below|over|under|a|an|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|can)\b/g,
        weight: 0.9
      },
      "de": {
        chars: /[a-zäöüß]/g,
        words: /\b(der|die|das|und|oder|aber|in|an|auf|zu|für|von|mit|bei|aus|über|unter|vor|nach|während|durch|ohne|gegen|um|bis|seit|wegen|trotz|statt|außer|ein|eine|ist|sind|war|waren|sein|haben|hat|hatte|werden|wird|wurde|kann|könnte|soll|sollte|muss|müssen|darf|dürfen)\b/g,
        weight: 0.8
      },
      "fr": {
        chars: /[a-zàâäèéêëîïôöùûüÿç]/g,
        words: /\b(le|la|les|de|du|des|et|ou|mais|dans|sur|avec|par|pour|sans|sous|vers|chez|entre|contre|pendant|avant|après|depuis|jusqu|alors|ainsi|aussi|encore|enfin|ensuite|puis|donc|car|parce|puisque|comme|si|quand|lorsque|où|que|qui|dont|lequel|laquelle|un|une|est|sont|était|étaient|être|avoir|a|avait|avaient|faire|fait|faisait|faisaient|aller|va|allait|allaient|venir|vient|venait|venaient|voir|voit|voyait|voyaient|savoir|sait|savait|savaient|pouvoir|peut|pouvait|pouvaient|vouloir|veut|voulait|voulaient|devoir|doit|devait|devaient)\b/g,
        weight: 0.8
      },
      "es": {
        chars: /[a-záéíóúñü]/g,
        words: /\b(el|la|los|las|de|del|y|o|pero|en|con|por|para|sin|sobre|bajo|hacia|desde|hasta|entre|contra|durante|antes|después|mientras|aunque|porque|como|si|cuando|donde|que|quien|cual|un|una|es|son|era|eran|ser|estar|está|están|estaba|estaban|tener|tiene|tenía|tenían|haber|hay|había|hacer|hace|hacía|hacían|ir|va|iba|iban|venir|viene|venía|venían|ver|ve|veía|veían|saber|sabe|sabía|sabían|poder|puede|podía|podían|querer|quiere|quería|querían|deber|debe|debía|debían)\b/g,
        weight: 0.8
      },
      "it": {
        chars: /[a-zàèìòù]/g,
        words: /\b(il|la|lo|gli|le|di|del|della|dello|degli|delle|e|o|ma|in|con|per|da|su|sotto|verso|fra|tra|contro|durante|prima|dopo|mentre|anche|ancora|così|quindi|però|se|quando|dove|che|chi|quale|un|una|è|sono|era|erano|essere|avere|ha|aveva|avevano|fare|fa|faceva|facevano|andare|va|andava|andavano|venire|viene|veniva|venivano|vedere|vede|vedeva|vedevano|sapere|sa|sapeva|sapevano|potere|può|poteva|potevano|volere|vuole|voleva|volevano|dovere|deve|doveva|dovevano)\b/g,
        weight: 0.8
      },
      "pt": {
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
      scores[lang] = charRatio * 0.6 + wordScore / 100 * 0.4;
    });
    const sortedLangs = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sortedLangs.length > 0 && sortedLangs[0][1] > 0.1) {
      const [topLang, topScore] = sortedLangs[0];
      const [secondLang, secondScore] = sortedLangs[1] || [null, 0];
      if (secondScore > 0 && topScore - secondScore < 0.05) {
        return `${topLang}+${secondLang}`;
      }
      return topLang;
    }
    return "unknown";
  }
  // Вспомогательные методы
  static extractFB2Text(element, tagName) {
    const el = element?.querySelector(tagName);
    return el?.textContent?.trim() || "";
  }
  static extractSectionTitle(section) {
    const titleEl = section.querySelector("title");
    if (titleEl) {
      return Array.from(titleEl.querySelectorAll("p")).map((p) => p.textContent?.trim()).filter(Boolean).join(" ");
    }
    return "";
  }
  static extractSectionContent(section) {
    const paragraphs = section.querySelectorAll("p");
    return Array.from(paragraphs).map((p) => p.textContent?.trim()).filter((text) => text && text.length > 5).join("\n\n");
  }
  static calculateTextQuality(text) {
    if (!text || text.length < 100) return 0;
    const readableChars = text.match(/[a-zA-Zа-яёА-ЯЁ0-9\s.,!?;:'"()\-]/g) || [];
    const readableRatio = readableChars.length / text.length;
    const russianChars = text.match(/[а-яёА-ЯЁ]/g) || [];
    const russianRatio = russianChars.length / text.length;
    const englishChars = text.match(/[a-zA-Z]/g) || [];
    const englishRatio = englishChars.length / text.length;
    let score = readableRatio * 0.7;
    if (russianRatio > 0.1) score += 0.2;
    if (englishRatio > 0.1) score += 0.1;
    if (text.match(/(.)\1{10,}/)) score -= 0.3;
    return score;
  }
  static intelligentChapterSplit(text) {
    const chapters = [];
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
    for (const pattern of chapterPatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > maxChapters && matches.length > 1) {
        maxChapters = matches.length;
        bestSplit = matches;
      }
    }
    if (bestSplit && bestSplit.length > 1) {
      for (let i = 0; i < bestSplit.length; i++) {
        const start = bestSplit[i].index;
        const end = i + 1 < bestSplit.length ? bestSplit[i + 1].index : text.length;
        const chapterText = text.slice(start, end).trim();
        if (chapterText.length > 100) {
          const lines = chapterText.split("\n");
          const title = lines[0].trim() || `\u0413\u043B\u0430\u0432\u0430 ${i + 1}`;
          const content = lines.slice(1).join("\n").trim();
          chapters.push({
            title: this.cleanText(title),
            content: this.cleanText(content || chapterText),
            index: i
          });
        }
      }
    }
    if (chapters.length === 0) {
      const words = text.split(/\s+/);
      const wordsPerChapter = Math.max(1e3, Math.floor(words.length / 20));
      let currentChapter = [];
      let chapterIndex = 0;
      for (let i = 0; i < words.length; i++) {
        currentChapter.push(words[i]);
        if (currentChapter.length >= wordsPerChapter) {
          for (let j = i; j < Math.min(i + 50, words.length); j++) {
            if (words[j].match(/[.!?]$/)) {
              i = j;
              break;
            }
          }
          const chapterText = currentChapter.join(" ").trim();
          if (chapterText.length > 100) {
            chapters.push({
              title: `\u0427\u0430\u0441\u0442\u044C ${chapterIndex + 1}`,
              content: this.cleanText(chapterText),
              index: chapterIndex
            });
            chapterIndex++;
          }
          currentChapter = [];
        }
      }
      if (currentChapter.length > 0) {
        const chapterText = currentChapter.join(" ").trim();
        if (chapterText.length > 100) {
          chapters.push({
            title: `\u0427\u0430\u0441\u0442\u044C ${chapterIndex + 1}`,
            content: this.cleanText(chapterText),
            index: chapterIndex
          });
        }
      }
    }
    return chapters.length > 0 ? chapters : [{
      title: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0442\u0435\u043A\u0441\u0442",
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
      author: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
      description: "",
      chapters,
      language: this.detectLanguage(cleanedText),
      wordCount: this.countWords(cleanedText),
      estimatedReadingTime: this.estimateReadingTime(cleanedText)
    };
  }
  static extractHTMLFromEPUB(text) {
    const htmlMatches = text.match(/<html[^>]*>[\s\S]*?<\/html>/gi) || [];
    return htmlMatches.join("\n");
  }
  static splitHTMLIntoChapters(html, bookTitle) {
    const textContent = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return this.intelligentChapterSplit(textContent);
  }
  static cleanText(text) {
    if (!text) return "";
    text = text.replace(/<[^>]*>/g, " ");
    const entities = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#039;": "'",
      "&apos;": "'",
      "&nbsp;": " ",
      "&mdash;": "\u2014",
      "&ndash;": "\u2013",
      "&hellip;": "\u2026",
      "&laquo;": "\xAB",
      "&raquo;": "\xBB",
      "&copy;": "\xA9",
      "&reg;": "\xAE",
      "&trade;": "\u2122"
    };
    Object.entries(entities).forEach(([entity, char]) => {
      text = text.replace(new RegExp(entity, "g"), char);
    });
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
    text = text.replace(/\r\n/g, "\n");
    text = text.replace(/\r/g, "\n");
    text = text.replace(/[ \t]+/g, " ");
    text = text.replace(/\n{3,}/g, "\n\n");
    text = text.trim();
    return text;
  }
  static extractTextFromXML(xml) {
    xml = xml.replace(/<\?xml[^>]*\?>/g, "");
    xml = xml.replace(/<!--[\s\S]*?-->/g, "");
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    return doc.textContent || xml.replace(/<[^>]*>/g, " ");
  }
  static detectLanguage(text) {
    if (!text) return "unknown";
    const russianChars = (text.match(/[а-яёА-ЯЁ]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const totalChars = russianChars + englishChars;
    if (totalChars === 0) return "unknown";
    const russianRatio = russianChars / totalChars;
    const englishRatio = englishChars / totalChars;
    if (russianRatio > 0.5) return "ru";
    if (englishRatio > 0.5) return "en";
    return "mixed";
  }
  static countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  }
  static estimateReadingTime(text) {
    const words = this.countWords(text);
    const wordsPerMinute = 200;
    const minutes = Math.ceil(words / wordsPerMinute);
    if (minutes < 60) {
      return `${minutes} \u043C\u0438\u043D`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} \u0447${remainingMinutes > 0 ? ` ${remainingMinutes} \u043C\u0438\u043D` : ""}`;
    }
  }
};
var LibraryManager = class {
  static async exportLibrary(books, readingStats, bookmarks, achievements, userSettings = {}) {
    try {
      const exportData = {
        version: "2.0.0",
        exportDate: (/* @__PURE__ */ new Date()).toISOString(),
        metadata: {
          totalBooks: books.length,
          totalBookmarks: Object.values(bookmarks).flat().length,
          achievementsCount: Object.values(achievements).filter(Boolean).length,
          exportedBy: "BookReader Pro"
        },
        library: {
          books: books.map((book) => ({
            ...book,
            // Сериализуем все данные книги
            exportedAt: (/* @__PURE__ */ new Date()).toISOString()
          })),
          readingStats,
          bookmarks,
          achievements,
          userSettings: {
            darkMode: userSettings.darkMode,
            ttsSettings: userSettings.ttsSettings,
            lastExport: (/* @__PURE__ */ new Date()).toISOString(),
            ...userSettings
          }
        }
      };
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob(["\uFEFF" + jsonString], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const fileName = `library_backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      const a = document.createElement("a");
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
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430:", error);
      throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438: ${error.message}`);
    }
  }
  static async importLibrary(file, onProgress) {
    try {
      onProgress?.({ status: "reading", progress: 10, message: "\u0427\u0438\u0442\u0430\u044E \u0444\u0430\u0439\u043B \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438..." });
      const arrayBuffer = await file.arrayBuffer();
      let text = "";
      try {
        const decoder = new TextDecoder("utf-8", { fatal: true });
        text = decoder.decode(arrayBuffer);
      } catch (e) {
        try {
          const decoder = new TextDecoder("windows-1251");
          text = decoder.decode(arrayBuffer);
        } catch (e2) {
          const decoder = new TextDecoder("iso-8859-1");
          text = decoder.decode(arrayBuffer);
        }
      }
      if (text.charCodeAt(0) === 65279) {
        text = text.slice(1);
      }
      const importData = JSON.parse(text);
      onProgress?.({ status: "validating", progress: 25, message: "\u041F\u0440\u043E\u0432\u0435\u0440\u044F\u044E \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0443 \u0434\u0430\u043D\u043D\u044B\u0445..." });
      this.validateImportData(importData);
      onProgress?.({ status: "processing", progress: 50, message: "\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E \u0434\u0430\u043D\u043D\u044B\u0435 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438..." });
      const { books, readingStats, bookmarks, achievements, userSettings } = importData.library;
      const processedBooks = await this.processImportedBooks(books, onProgress);
      const processedStats = this.processImportedStats(readingStats);
      const processedBookmarks = this.processImportedBookmarks(bookmarks);
      const processedAchievements = this.processImportedAchievements(achievements);
      const processedSettings = this.processImportedSettings(userSettings);
      onProgress?.({ status: "completed", progress: 100, message: "\u0418\u043C\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D \u0443\u0441\u043F\u0435\u0448\u043D\u043E!" });
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
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043C\u043F\u043E\u0440\u0442\u0430:", error);
      throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043C\u043F\u043E\u0440\u0442\u0430 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438: ${error.message}`);
    }
  }
  static validateImportData(data) {
    if (!data || typeof data !== "object") {
      throw new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430 \u0444\u0430\u0439\u043B\u0430");
    }
    if (!data.version) {
      throw new Error("\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0432\u0435\u0440\u0441\u0438\u044F \u0444\u0430\u0439\u043B\u0430 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430");
    }
    if (!data.library) {
      throw new Error("\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442 \u0434\u0430\u043D\u043D\u044B\u0435 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438");
    }
    if (!Array.isArray(data.library.books)) {
      throw new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u043A\u043D\u0438\u0433");
    }
    const supportedVersions = ["1.0.0", "2.0.0"];
    if (!supportedVersions.includes(data.version)) {
      console.warn(`\u0412\u0435\u0440\u0441\u0438\u044F ${data.version} \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u043D\u0435 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0441\u043E\u0432\u043C\u0435\u0441\u0442\u0438\u043C\u0430`);
    }
  }
  static async processImportedBooks(books, onProgress) {
    const processedBooks = [];
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      const fixedTitle = this.fixEncoding(book.title);
      const fixedAuthor = this.fixEncoding(book.author);
      const fixedDescription = this.fixEncoding(book.description || "");
      onProgress?.({
        status: "processing",
        progress: 50 + i / books.length * 30,
        message: `\u041E\u0431\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E \u043A\u043D\u0438\u0433\u0443: ${fixedTitle}...`
      });
      const processedBook = {
        ...book,
        id: book.id || `imported_book_${Date.now()}_${i}`,
        title: fixedTitle,
        author: fixedAuthor,
        description: fixedDescription,
        addedDate: book.addedDate || (/* @__PURE__ */ new Date()).toISOString(),
        imported: true,
        importedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (processedBook.chapters) {
        processedBook.chapters = processedBook.chapters.map((chapter, chIndex) => ({
          ...chapter,
          title: this.fixEncoding(chapter.title || `\u0413\u043B\u0430\u0432\u0430 ${chIndex + 1}`),
          content: chapter.content ? this.fixEncoding(chapter.content) : chapter.content,
          index: chIndex
        }));
      }
      if (!processedBook.cover || processedBook.cover === "") {
        processedBook.cover = `keys/book-cover-${encodeURIComponent(processedBook.title)}?prompt=${encodeURIComponent(processedBook.title + " book cover classic literature")}`;
      }
      processedBooks.push(processedBook);
    }
    return processedBooks;
  }
  // Функция для исправления кодировки
  static fixEncoding(text) {
    if (!text || typeof text !== "string") return text;
    const hasEncodingIssues = text.includes("\u0420") && text.includes("\u0421");
    if (!hasEncodingIssues) return text;
    try {
      const bytes = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) {
        bytes[i] = text.charCodeAt(i) & 255;
      }
      const decoder = new TextDecoder("utf-8");
      const fixed = decoder.decode(bytes);
      if (fixed.length > 0 && !fixed.includes("\u0420")) {
        return fixed;
      }
    } catch (e) {
    }
    let fixedText = text;
    const replacements = [
      ["\u0420\u0432\u0420\u043E\u0421\u0402\u0420\u043E\u0420\u045A\u0420\u043E\u0420\u0412", "\u0412\u043E\u0440\u043E\u043D\u043E\u0432"],
      ["\u0420\u0459\u0420\u043E\u0421\u0402\u0420\u043E\u0420\u0459\u0421\u040A", "\u041A\u043E\u0440\u043E\u043B\u044C"],
      ["\u0420\u045A\u0420\u043E\u0421\u0402\u0420\u0430", "\u041D\u043E\u0440\u0430"],
      ["\u0420\u0404\u0420\u0430\u0420\u045A\u0420\u0430\u0420\u0412\u0420\u0451\u0421\u040A", "\u0421\u0430\u043A\u0430\u0432\u0438\u0447"],
      ["\u0420\u045C\u0420\u043E\u0420\u0459\u0420\u045A\u0420\u0451\u0420\u045A", "\u0422\u043E\u043B\u043A\u0438\u043D"],
      ["\u0420\u2013\u0420\u043E\u0421\u0403\u0421\u201A\u0420\u043E\u0420\u0415\u0420\u0412\u0421\u0403\u0420\u045A\u0420\u0451\u0420\u0419", "\u0414\u043E\u0441\u0442\u043E\u0435\u0432\u0441\u043A\u0438\u0439"],
      ["\u0420\u041F\u0421\u0453\u0421\u02C6\u0420\u045A\u0420\u0451\u0420\u045A", "\u041F\u0443\u0448\u043A\u0438\u043D"],
      ["\u0420\xA7\u0420\u0415\u0421\u2026\u0420\u043E\u0420\u0412", "\u0427\u0435\u0445\u043E\u0432"]
    ];
    for (const [corrupted, correct] of replacements) {
      try {
        if (fixedText.includes(corrupted)) {
          fixedText = fixedText.split(corrupted).join(correct);
        }
      } catch (e) {
        continue;
      }
    }
    try {
      fixedText = fixedText.replace(/Р[^\u0400-\u04FF]/g, "\u0420").replace(/С[^\u0400-\u04FF]/g, "\u0421").trim();
    } catch (e) {
    }
    return fixedText;
  }
  static processImportedStats(stats) {
    if (!stats || typeof stats !== "object") {
      return {};
    }
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
    if (!bookmarks || typeof bookmarks !== "object") {
      return {};
    }
    const processedBookmarks = {};
    Object.entries(bookmarks).forEach(([bookId, bookmarkList]) => {
      if (Array.isArray(bookmarkList)) {
        processedBookmarks[bookId] = bookmarkList.map((bookmark) => ({
          ...bookmark,
          id: bookmark.id || `imported_bookmark_${Date.now()}_${Math.random()}`,
          timestamp: bookmark.timestamp || Date.now()
        }));
      }
    });
    return processedBookmarks;
  }
  static processImportedAchievements(achievements) {
    if (!achievements || typeof achievements !== "object") {
      return {};
    }
    const validAchievements = {};
    const knownAchievements = ["collector", "reader", "bookmarker", "active", "wordMaster", "consistent"];
    knownAchievements.forEach((key) => {
      validAchievements[key] = Boolean(achievements[key]);
    });
    return validAchievements;
  }
  static processImportedSettings(settings) {
    if (!settings || typeof settings !== "object") {
      return {};
    }
    return {
      darkMode: Boolean(settings.darkMode),
      ttsSettings: settings.ttsSettings || {
        voice: "",
        rate: 1,
        pitch: 1,
        volume: 1
      },
      importedAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...settings
    };
  }
  static async mergeWithExistingLibrary(existingBooks, importedBooks, strategy = "merge") {
    switch (strategy) {
      case "replace":
        return importedBooks;
      case "merge":
        const existingTitles = new Set(existingBooks.map(
          (book) => `${book.title.toLowerCase()}_${book.author.toLowerCase()}`
        ));
        const newBooks = importedBooks.filter(
          (book) => !existingTitles.has(`${book.title.toLowerCase()}_${book.author.toLowerCase()}`)
        );
        return [...existingBooks, ...newBooks];
      case "keep-existing":
        return existingBooks;
      default:
        return [...existingBooks, ...importedBooks];
    }
  }
  static generateBackupInfo(books, readingStats, bookmarks) {
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
    const textBooks = books.filter((b) => b.type === "text").length;
    const audioBooks = books.filter((b) => b.type === "audio").length;
    const completedBooks = books.filter((book) => {
      const progress = readingStats[book.id]?.progress || 0;
      return progress >= 100;
    }).length;
    return {
      summary: `\u{1F4DA} ${books.length} \u043A\u043D\u0438\u0433 (\u{1F4D6} ${textBooks} \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0445, \u{1F3A7} ${audioBooks} \u0430\u0443\u0434\u0438\u043E)`,
      details: [
        `\u{1F4CA} \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: ${completedBooks} \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E`,
        `\u{1F516} \u0417\u0430\u043A\u043B\u0430\u0434\u043E\u043A: ${Object.values(bookmarks).flat().length}`,
        `\u{1F4DD} \u0412\u0441\u0435\u0433\u043E \u0441\u043B\u043E\u0432: ${totalWords.toLocaleString()}`,
        `\u{1F4C5} \u0421\u043E\u0437\u0434\u0430\u043D: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`
      ],
      totalWords,
      totalBooks: books.length,
      totalBookmarks: Object.values(bookmarks).flat().length,
      completedBooks
    };
  }
};
var AudioBookLoader = class {
  static async loadFromURL(url, title = "", chapter = 1) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("audio/")) {
        throw new Error("URL \u043D\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0430\u0443\u0434\u0438\u043E \u0444\u0430\u0439\u043B");
      }
      const contentLength = response.headers.get("content-length");
      const size = contentLength ? parseInt(contentLength) : 0;
      return {
        url,
        title: title || `\u0413\u043B\u0430\u0432\u0430 ${chapter}`,
        duration: 0,
        size,
        type: "url"
      };
    } catch (error) {
      throw new Error(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 ${url}: ${error.message}`);
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
          status: "loading"
        });
        const chapter = await this.loadFromURL(url, "", i + 1);
        chapters.push(chapter);
        onProgress?.({
          current: i + 1,
          total: urls.length,
          url,
          status: "success"
        });
      } catch (error) {
        onProgress?.({
          current: i + 1,
          total: urls.length,
          url,
          status: "error",
          error: error.message
        });
      }
    }
    return chapters;
  }
  static async createAudioBook(chapters, title, author) {
    return {
      id: `audiobook_${Date.now()}`,
      title: title || `\u0410\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0430 ${chapters.length} \u0433\u043B\u0430\u0432`,
      author: author || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
      type: "audio",
      chapters,
      addedDate: (/* @__PURE__ */ new Date()).toISOString(),
      progress: 0,
      currentChapter: 0,
      cover: "assets/audiobook-cover.png?prompt=audiobook%20headphones%20sound%20waves%20modern%20design",
      totalDuration: 0,
      totalSize: chapters.reduce((sum, ch) => sum + (ch.size || 0), 0)
    };
  }
};
var TTSManager = class {
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
        this.synth.addEventListener("voiceschanged", loadVoices);
        loadVoices();
      } else {
        resolve(this.voices);
      }
    });
  }
  getVoicesByLanguage(lang = "ru") {
    return this.voices.filter(
      (voice) => voice.lang.startsWith(lang) || voice.name.toLowerCase().includes("russian") || voice.name.toLowerCase().includes("rus") || voice.name.toLowerCase().includes("maria") || voice.name.toLowerCase().includes("yuri")
    );
  }
  splitIntoSentences(text) {
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [];
    return sentences.map((s) => s.trim()).filter((s) => s.length > 0).map((s) => {
      if (s.length > 200) {
        const parts = s.split(/[,;:]/);
        return parts.filter((p) => p.trim().length > 0);
      }
      return [s];
    }).flat();
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
    const voice = this.voices.find((v) => v.name === options.voice) || this.getVoicesByLanguage("ru")[0] || this.voices[0];
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
      console.error("TTS Error:", event.error);
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
      currentText: this.sentences[this.currentSentence] || ""
    };
  }
};
var AIAssistant = class {
  constructor() {
    this.learningData = JSON.parse(localStorage.getItem("aiLearningData") || "[]");
    this.conversationHistory = [];
    this.bookAnalysisCache = /* @__PURE__ */ new Map();
    this.apiKey = localStorage.getItem("openrouter_api_key") || "";
    this.apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    this.model = "qwen/qwq-32b:free";
  }
  async callOpenRouterAPI(messages) {
    if (!this.apiKey) {
      throw new Error("API \u043A\u043B\u044E\u0447 \u043D\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 OPENROUTER_API_KEY \u0432 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u044F \u0438\u043B\u0438 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F.");
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
          messages,
          max_tokens: 1e3,
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
      console.error("OpenRouter API Error:", error);
      throw error;
    }
  }
  async searchInternet(query) {
    try {
      const messages = [
        {
          role: "system",
          content: "\u0422\u044B - \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u043F\u043E \u043F\u043E\u0438\u0441\u043A\u0443 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438. \u041F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u044C \u043A\u0440\u0430\u0442\u043A\u0443\u044E \u0438 \u0442\u043E\u0447\u043D\u0443\u044E \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F. \u041E\u0442\u0432\u0435\u0447\u0430\u0439 \u043D\u0430 \u0440\u0443\u0441\u0441\u043A\u043E\u043C \u044F\u0437\u044B\u043A\u0435."
        },
        {
          role: "user",
          content: `\u041D\u0430\u0439\u0434\u0438 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u043E: ${query}`
        }
      ];
      const result = await this.callOpenRouterAPI(messages);
      const cleanedResult = result.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<thinking>[\s\S]*?<\/thinking>/g, "").replace(/^\s+|\s+$/g, "").trim();
      return [{
        title: `\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E "${query}"`,
        snippet: cleanedResult,
        url: `https://search.example.com/q=${encodeURIComponent(query)}`,
        relevance: 0.9
      }];
    } catch (error) {
      console.error("Search error:", error);
      return [{
        title: `\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043F\u043E\u0438\u0441\u043A\u0430 \u0434\u043B\u044F "${query}"`,
        snippet: `\u0418\u0437\u0432\u0438\u043D\u0438\u0442\u0435, \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u0438\u0437 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0435\u0440\u0435\u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441.`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        relevance: 0.5
      }];
    }
  }
  async analyzeBook(bookContent, question) {
    const cacheKey = `${bookContent.substring(0, 100)}_${question}`;
    if (this.bookAnalysisCache.has(cacheKey)) {
      return this.bookAnalysisCache.get(cacheKey);
    }
    try {
      if (bookContent.length > 1e4) {
        const words = bookContent.toLowerCase().split(/\s+/);
        const questionWords = question.toLowerCase().split(/\s+/).filter((word) => word.length > 2).filter((word) => !["\u0447\u0442\u043E", "\u043A\u0430\u043A", "\u0433\u0434\u0435", "\u043A\u043E\u0433\u0434\u0430", "\u043F\u043E\u0447\u0435\u043C\u0443", "\u0437\u0430\u0447\u0435\u043C", "\u043A\u0442\u043E"].includes(word));
        const sentences = bookContent.split(/[.!?]+/);
        const relevantSentences = [];
        sentences.forEach((sentence) => {
          const sentenceLower = sentence.toLowerCase();
          let score = 0;
          questionWords.forEach((word) => {
            const wordRegex = new RegExp(`\\b${word}\\b`, "gi");
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
        const result2 = relevantSentences.sort((a, b) => b.score - a.score).slice(0, 5).map((r) => r.sentence).join("\n\n");
        this.bookAnalysisCache.set(cacheKey, result2);
        return result2;
      }
      const messages = [
        {
          role: "system",
          content: "\u0422\u044B - \u043B\u0438\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A. \u041F\u0440\u043E\u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0439 \u0442\u0435\u043A\u0441\u0442 \u0438 \u043E\u0442\u0432\u0435\u0442\u044C \u043D\u0430 \u0432\u043E\u043F\u0440\u043E\u0441 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F, \u043E\u0441\u043D\u043E\u0432\u044B\u0432\u0430\u044F\u0441\u044C \u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0438. \u041E\u0442\u0432\u0435\u0447\u0430\u0439 \u043A\u0440\u0430\u0442\u043A\u043E \u0438 \u043F\u043E \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443."
        },
        {
          role: "user",
          content: `\u0422\u0435\u043A\u0441\u0442: ${bookContent.substring(0, 8e3)}...

\u0412\u043E\u043F\u0440\u043E\u0441: ${question}`
        }
      ];
      const result = await this.callOpenRouterAPI(messages);
      const cleanedResult = result.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<thinking>[\s\S]*?<\/thinking>/g, "").replace(/^\s+|\s+$/g, "").trim();
      this.bookAnalysisCache.set(cacheKey, cleanedResult);
      return cleanedResult;
    } catch (error) {
      console.error("Book analysis error:", error);
      const words = bookContent.toLowerCase().split(/\s+/);
      const questionWords = question.toLowerCase().split(/\s+/).filter((word) => word.length > 2).filter((word) => !["\u0447\u0442\u043E", "\u043A\u0430\u043A", "\u0433\u0434\u0435", "\u043A\u043E\u0433\u0434\u0430", "\u043F\u043E\u0447\u0435\u043C\u0443", "\u0437\u0430\u0447\u0435\u043C", "\u043A\u0442\u043E"].includes(word));
      const sentences = bookContent.split(/[.!?]+/);
      const relevantSentences = [];
      sentences.forEach((sentence) => {
        const sentenceLower = sentence.toLowerCase();
        let score = 0;
        questionWords.forEach((word) => {
          const wordRegex = new RegExp(`\\b${word}\\b`, "gi");
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
      const result = relevantSentences.sort((a, b) => b.score - a.score).slice(0, 5).map((r) => r.sentence).join("\n\n");
      this.bookAnalysisCache.set(cacheKey, result);
      return result;
    }
  }
  async generateSummary(bookContent, maxLength = 300) {
    const sentences = bookContent.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    if (sentences.length <= 3) {
      return bookContent.substring(0, maxLength);
    }
    const beginning = sentences.slice(0, 2).join(". ");
    const middle = sentences.slice(Math.floor(sentences.length / 2), Math.floor(sentences.length / 2) + 1).join(". ");
    const end = sentences.slice(-2).join(". ");
    const summary = `${beginning}. ${middle}. ${end}.`;
    return summary.length > maxLength ? summary.substring(0, maxLength) + "..." : summary;
  }
  async analyzeReadingPattern(books, readingStats) {
    const patterns = {
      favoriteGenres: {},
      readingSpeed: 0,
      preferredLength: "medium",
      readingTimes: {},
      completionRate: 0
    };
    books.forEach((book) => {
      const stats = readingStats[book.id] || {};
      if (book.genres) {
        book.genres.forEach((genre) => {
          patterns.favoriteGenres[genre] = (patterns.favoriteGenres[genre] || 0) + 1;
        });
      }
      if (stats.lastRead) {
        const hour = new Date(stats.lastRead).getHours();
        patterns.readingTimes[hour] = (patterns.readingTimes[hour] || 0) + 1;
      }
      if (stats.readingTime && book.wordCount) {
        const wordsPerMinute = book.wordCount / (stats.readingTime / 6e4);
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
      keywords: this.extractKeywords(question + " " + answer),
      satisfaction: null
      // Может быть установлен пользователем
    };
    this.learningData.push(learningEntry);
    if (this.learningData.length > 1e3) {
      this.learningData = this.learningData.slice(-800);
    }
    localStorage.setItem("aiLearningData", JSON.stringify(this.learningData));
  }
  extractKeywords(text) {
    const stopWords = /* @__PURE__ */ new Set([
      "\u0438",
      "\u0432",
      "\u043D\u0430",
      "\u0441",
      "\u043F\u043E",
      "\u0434\u043B\u044F",
      "\u043D\u0435",
      "\u043E\u0442",
      "\u0437\u0430",
      "\u043A",
      "\u0434\u043E",
      "\u0438\u0437",
      "\u043E",
      "\u043E\u0431",
      "\u0443",
      "\u0430",
      "\u043D\u043E",
      "\u0447\u0442\u043E",
      "\u043A\u0430\u043A",
      "\u044D\u0442\u043E",
      "\u0442\u043E",
      "\u0442\u0430\u043A",
      "\u0431\u044B",
      "\u0436\u0435",
      "\u043B\u0438",
      "\u0443\u0436\u0435",
      "\u0435\u0441\u043B\u0438",
      "\u0434\u0430",
      "\u043D\u0435\u0442",
      "\u0438\u043B\u0438",
      "\u0435\u0449\u0435",
      "\u0432\u0441\u0435",
      "\u0432\u0441\u044F",
      "\u0432\u0435\u0441\u044C",
      "\u043F\u0440\u0438",
      "\u043F\u0440\u043E",
      "\u043F\u043E\u0434",
      "\u043D\u0430\u0434",
      "\u043C\u0435\u0436\u0434\u0443",
      "\u0447\u0435\u0440\u0435\u0437",
      "\u0431\u0435\u0437",
      "\u043A\u0440\u043E\u043C\u0435",
      "\u043F\u043E\u0441\u043B\u0435",
      "\u043F\u0435\u0440\u0435\u0434",
      "\u0432\u043E",
      "\u0441\u043E",
      "\u043A\u043E",
      "\u0440\u043E",
      "\u0430\u043D",
      "\u0438\u0432",
      "\u043B\u044C",
      "\u043D\u044B",
      "\u043E\u0447",
      "\u043E\u043C",
      "\u0442\u0443",
      "\u043A\u0435",
      "\u0430\u0439",
      "\u0438\u0439",
      "\u043E\u0439",
      "\u044B\u0439",
      "\u0435\u0439",
      "\u0451\u043C",
      "\u043E\u043C",
      "\u0430\u043C",
      "\u043C\u0438",
      "\u044B\u0445",
      "\u0438\u0445",
      "\u0438\u0435",
      "\u044B\u0435",
      "\u043E\u0435",
      "\u0430\u044F",
      "\u0430\u044F",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u0430\u044F",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "\u0435\u0439",
      "\u043E\u0439",
      "\u0443\u044E",
      "\u043E\u0439",
      "and",
      "or",
      "but",
      "the",
      "a",
      "an",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "can",
      "shall",
      "to",
      "of",
      "in",
      "for",
      "on",
      "with",
      "by",
      "from",
      "up",
      "about",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "down",
      "out",
      "off",
      "over",
      "under",
      "again",
      "further",
      "then",
      "once"
    ]);
    const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter((word) => word.length > 3 && !stopWords.has(word));
    const frequency = {};
    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    return Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word]) => word);
  }
  findSimilarQuestions(question) {
    const questionKeywords = this.extractKeywords(question);
    return this.learningData.map((entry) => ({
      ...entry,
      similarity: entry.keywords.filter((k) => questionKeywords.includes(k)).length
    })).filter((entry) => entry.similarity > 0).sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }
  async generateResponse(question, userBooks = []) {
    try {
      const similarQuestions = this.findSimilarQuestions(question);
      if (similarQuestions.length > 0) {
        const best = similarQuestions[0];
        return {
          text: `\u041D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u043C\u043E\u0435\u0433\u043E \u043E\u043F\u044B\u0442\u0430: ${best.answer}`,
          source: "learning",
          confidence: best.similarity / 10,
          relatedQuestions: similarQuestions.slice(1, 3).map((q) => q.question)
        };
      }
      const questionLower = question.toLowerCase();
      if (questionLower.includes("\u043A\u043D\u0438\u0433") || questionLower.includes("\u0442\u0435\u043A\u0441\u0442") || questionLower.includes("\u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435")) {
        for (const book of userBooks) {
          if (book.chapters && book.chapters.length > 0) {
            const bookContent = book.chapters.map((ch) => ch.content).join("\n");
            const analysis = await this.analyzeBook(bookContent, question);
            if (analysis && analysis.length > 50) {
              const summary = await this.generateSummary(analysis);
              return {
                text: `\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u0432 \u043A\u043D\u0438\u0433\u0435 "${book.title}":

${summary}`,
                source: "book",
                bookTitle: book.title,
                fullAnalysis: analysis
              };
            }
          }
        }
      }
      if (questionLower.includes("\u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A") || questionLower.includes("\u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441") || questionLower.includes("\u0441\u043A\u043E\u043B\u044C\u043A\u043E")) {
        const stats = this.analyzeLibraryStats(userBooks);
        return {
          text: `\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0432\u0430\u0448\u0435\u0439 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438:

${stats}`,
          source: "analysis"
        };
      }
      if (questionLower.includes("\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434") || questionLower.includes("\u0441\u043E\u0432\u0435\u0442\u0443\u0439") || questionLower.includes("\u0447\u0442\u043E \u0447\u0438\u0442\u0430\u0442\u044C")) {
        const recommendations = this.generateBookRecommendations(userBooks);
        return {
          text: `\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u0434\u043B\u044F \u0447\u0442\u0435\u043D\u0438\u044F:

${recommendations}`,
          source: "recommendation"
        };
      }
      const booksContext = userBooks.length > 0 ? `\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 ${userBooks.length} \u043A\u043D\u0438\u0433: ${userBooks.map((b) => `"${b.title}" (${b.author})`).join(", ")}.` : "\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u043F\u0443\u0441\u0442\u0430.";
      const messages = [
        {
          role: "system",
          content: `\u0422\u044B - \u0443\u043C\u043D\u044B\u0439 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A \u0434\u043B\u044F \u0446\u0438\u0444\u0440\u043E\u0432\u043E\u0439 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438. \u0422\u044B \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0448\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C \u0441 \u043A\u043D\u0438\u0433\u0430\u043C\u0438, \u0430\u043D\u0430\u043B\u0438\u0437\u043E\u043C \u0447\u0442\u0435\u043D\u0438\u044F, \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u044F\u043C\u0438 \u0438 \u043E\u0431\u0449\u0438\u043C\u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u0430\u043C\u0438 \u043E \u043B\u0438\u0442\u0435\u0440\u0430\u0442\u0443\u0440\u0435. 
          
          \u041A\u043E\u043D\u0442\u0435\u043A\u0441\u0442: ${booksContext}
          
          \u041E\u0442\u0432\u0435\u0447\u0430\u0439 \u0434\u0440\u0443\u0436\u0435\u043B\u044E\u0431\u043D\u043E \u0438 \u043F\u043E\u043B\u0435\u0437\u043D\u043E \u043D\u0430 \u0440\u0443\u0441\u0441\u043A\u043E\u043C \u044F\u0437\u044B\u043A\u0435. \u0415\u0441\u043B\u0438 \u0432\u043E\u043F\u0440\u043E\u0441 \u043A\u0430\u0441\u0430\u0435\u0442\u0441\u044F \u043A\u043D\u0438\u0433 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u0438\u0437 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0430.`
        },
        {
          role: "user",
          content: question
        }
      ];
      const aiResponse = await this.callOpenRouterAPI(messages);
      const cleanedResponse = aiResponse.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<thinking>[\s\S]*?<\/thinking>/g, "").replace(/^\s+|\s+$/g, "").trim();
      return {
        text: cleanedResponse,
        source: "ai",
        confidence: 0.8,
        suggestions: [
          "\u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438 \u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0438 \u043A\u043D\u0438\u0433\u0438 [\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435]",
          "\u041A\u0430\u043A\u0430\u044F \u043C\u043E\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0447\u0442\u0435\u043D\u0438\u044F?",
          "\u0427\u0442\u043E \u043C\u043D\u0435 \u043F\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0434\u0430\u043B\u044C\u0448\u0435?",
          "\u041F\u0440\u043E\u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0439 \u043C\u043E\u0438 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0435\u043D\u0438\u044F"
        ]
      };
    } catch (error) {
      console.error("AI Response Error:", error);
      try {
        const searchResults = await this.searchInternet(question);
        return {
          text: `\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043F\u043E\u0438\u0441\u043A\u0430:

${searchResults[0]?.snippet || "\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430"}`,
          source: "internet",
          results: searchResults.slice(0, 3)
        };
      } catch (searchError) {
        return {
          text: "\u0418\u0437\u0432\u0438\u043D\u0438\u0442\u0435, \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u0432\u0430\u0448\u0435\u0433\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u0435\u0440\u0435\u0444\u043E\u0440\u043C\u0443\u043B\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0432\u043E\u043F\u0440\u043E\u0441 \u0438\u043B\u0438 \u0437\u0430\u0434\u0430\u0442\u044C \u0431\u043E\u043B\u0435\u0435 \u043A\u043E\u043D\u043A\u0440\u0435\u0442\u043D\u044B\u0439 \u0432\u043E\u043F\u0440\u043E\u0441 \u043E \u0432\u0430\u0448\u0438\u0445 \u043A\u043D\u0438\u0433\u0430\u0445.",
          source: "error",
          suggestions: [
            "\u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438 \u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0438 \u043A\u043D\u0438\u0433\u0438 [\u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435]",
            "\u041A\u0430\u043A\u0430\u044F \u043C\u043E\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0447\u0442\u0435\u043D\u0438\u044F?",
            "\u0427\u0442\u043E \u043C\u043D\u0435 \u043F\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0434\u0430\u043B\u044C\u0448\u0435?",
            "\u041D\u0430\u0439\u0434\u0438 \u0446\u0438\u0442\u0430\u0442\u044B \u043E [\u0442\u0435\u043C\u0430] \u0432 \u043C\u043E\u0438\u0445 \u043A\u043D\u0438\u0433\u0430\u0445"
          ]
        };
      }
    }
  }
  analyzeLibraryStats(books) {
    const totalBooks = books.length;
    const textBooks = books.filter((b) => b.type === "text").length;
    const audioBooks = books.filter((b) => b.type === "audio").length;
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
    const totalReadingTime = books.reduce((sum, book) => {
      const time = book.estimatedReadingTime || "0 \u043C\u0438\u043D";
      const minutes = parseInt(time.match(/\d+/) || [0])[0];
      return sum + (time.includes("\u0447") ? minutes * 60 : minutes);
    }, 0);
    const languages = {};
    books.forEach((book) => {
      const lang = book.language || "unknown";
      languages[lang] = (languages[lang] || 0) + 1;
    });
    const stats = [
      `\u{1F4DA} \u0412\u0441\u0435\u0433\u043E \u043A\u043D\u0438\u0433: ${totalBooks}`,
      `\u{1F4D6} \u0422\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0445: ${textBooks}`,
      `\u{1F3A7} \u0410\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433: ${audioBooks}`,
      `\u{1F4DD} \u041E\u0431\u0449\u0435\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0441\u043B\u043E\u0432: ${totalWords.toLocaleString()}`,
      `\u23F1\uFE0F \u0412\u0440\u0435\u043C\u044F \u0447\u0442\u0435\u043D\u0438\u044F: ${Math.floor(totalReadingTime / 60)} \u0447 ${totalReadingTime % 60} \u043C\u0438\u043D`,
      `\u{1F30D} \u042F\u0437\u044B\u043A\u0438: ${Object.entries(languages).map(([lang, count]) => `${lang} (${count})`).join(", ")}`
    ];
    return stats.join("\n");
  }
  generateBookRecommendations(books) {
    if (books.length === 0) {
      return "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u043A\u043D\u0438\u0433 \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0435. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043A\u043D\u0438\u0433, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438!";
    }
    const unreadBooks = books.filter((book) => {
      const progress = book.progress || 0;
      return progress < 100;
    });
    const completedBooks = books.filter((book) => {
      const progress = book.progress || 0;
      return progress >= 100;
    });
    const inProgressBooks = books.filter((book) => {
      const progress = book.progress || 0;
      return progress > 0 && progress < 100;
    });
    const recommendations = ["\u041D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0432\u0430\u0448\u0435\u0439 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u044E:"];
    if (inProgressBooks.length > 0) {
      recommendations.push("", "\u{1F4D6} \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u0435 \u0447\u0442\u0435\u043D\u0438\u0435:");
      inProgressBooks.slice(0, 3).forEach((book) => {
        recommendations.push(`\u{1F4DA} "${book.title}" - ${book.author} (${Math.round(book.progress || 0)}% \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E)`);
      });
    }
    if (unreadBooks.length > 0) {
      recommendations.push("", "\u{1F195} \u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0447\u0438\u0442\u0430\u0442\u044C:");
      unreadBooks.slice(0, 3).forEach((book) => {
        let reason = "";
        if (book.type === "audio") {
          reason = " (\u0430\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0430)";
        } else if (book.wordCount && book.wordCount < 5e4) {
          reason = " (\u043A\u043E\u0440\u043E\u0442\u043A\u0430\u044F)";
        } else if (book.estimatedReadingTime) {
          reason = ` (${book.estimatedReadingTime})`;
        }
        recommendations.push(`\u{1F4DA} "${book.title}" - ${book.author}${reason}`);
      });
    }
    if (completedBooks.length > 0) {
      recommendations.push("", "\u{1F504} \u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u043D\u0430 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435:");
      const favoriteAuthors = {};
      completedBooks.forEach((book) => {
        if (book.author) {
          favoriteAuthors[book.author] = (favoriteAuthors[book.author] || 0) + 1;
        }
      });
      const sameAuthorBooks = books.filter((book) => {
        const progress = book.progress || 0;
        return progress < 100 && favoriteAuthors[book.author];
      });
      sameAuthorBooks.slice(0, 2).forEach((book) => {
        recommendations.push(`\u{1F4DA} "${book.title}" - ${book.author} (\u043B\u044E\u0431\u0438\u043C\u044B\u0439 \u0430\u0432\u0442\u043E\u0440)`);
      });
    }
    recommendations.push("");
    recommendations.push(`\u{1F4CA} \u0412 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0435: ${books.length} \u043A\u043D\u0438\u0433`);
    recommendations.push(`\u2705 \u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E: ${completedBooks.length} \u043A\u043D\u0438\u0433`);
    recommendations.push(`\u{1F4D6} \u0412 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435: ${inProgressBooks.length} \u043A\u043D\u0438\u0433`);
    recommendations.push(`\u{1F195} \u041D\u0435 \u043D\u0430\u0447\u0430\u0442\u043E: ${unreadBooks.length} \u043A\u043D\u0438\u0433`);
    return recommendations.join("\n");
  }
  getStatistics() {
    const total = this.learningData.length;
    const today = (/* @__PURE__ */ new Date()).toDateString();
    const todayCount = this.learningData.filter(
      (entry) => new Date(entry.timestamp).toDateString() === today
    ).length;
    const keywordFreq = {};
    this.learningData.forEach((entry) => {
      entry.keywords.forEach((keyword) => {
        keywordFreq[keyword] = (keywordFreq[keyword] || 0) + 1;
      });
    });
    const topKeywords = Object.entries(keywordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return {
      totalInteractions: total,
      todayInteractions: todayCount,
      topKeywords,
      learningRate: total > 0 ? todayCount / total : 0,
      accuracy: this.calculateAccuracy()
    };
  }
  calculateAccuracy() {
    const ratedInteractions = this.learningData.filter((entry) => entry.satisfaction !== null);
    if (ratedInteractions.length === 0) return 0;
    const positiveRatings = ratedInteractions.filter((entry) => entry.satisfaction > 3).length;
    return positiveRatings / ratedInteractions.length;
  }
  rateSatisfaction(questionId, rating) {
    const entry = this.learningData.find((entry2) => entry2.timestamp === questionId);
    if (entry) {
      entry.satisfaction = rating;
      localStorage.setItem("aiLearningData", JSON.stringify(this.learningData));
    }
  }
};
var RecommendationEngine = class {
  constructor() {
    this.userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
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
    books.forEach((book) => {
      const stats = readingHistory[book.id] || {};
      if (book.author) {
        patterns.authors[book.author] = (patterns.authors[book.author] || 0) + 1;
      }
      if (book.genres) {
        book.genres.forEach((genre) => {
          patterns.genres[genre] = (patterns.genres[genre] || 0) + 1;
        });
      }
      if (book.language) {
        patterns.languages[book.language] = (patterns.languages[book.language] || 0) + 1;
      }
      if (stats.lastRead) {
        const hour = new Date(stats.lastRead).getHours();
        patterns.readingTime[hour] = (patterns.readingTime[hour] || 0) + 1;
      }
      const chapterCount = book.chapters?.length || 0;
      const lengthCategory = chapterCount < 5 ? "short" : chapterCount < 15 ? "medium" : "long";
      patterns.bookLength[lengthCategory] = (patterns.bookLength[lengthCategory] || 0) + 1;
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
    const unreadBooks = books.filter((book) => {
      const progress = readingHistory[book.id]?.progress || 0;
      return progress < 100;
    });
    const completedBooks = books.filter((book) => {
      const progress = readingHistory[book.id]?.progress || 0;
      return progress >= 100;
    });
    const inProgressBooks = books.filter((book) => {
      const progress = readingHistory[book.id]?.progress || 0;
      return progress > 0 && progress < 100;
    });
    const recommendations = [];
    inProgressBooks.forEach((book) => {
      const progress = readingHistory[book.id]?.progress || 0;
      recommendations.push({
        ...book,
        id: `continue_${book.id}`,
        recommended: true,
        personalizedScore: 5 + progress / 100,
        // Высокий скор для продолжения
        personalizedReason: `\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0447\u0442\u0435\u043D\u0438\u0435 (${Math.round(progress)}% \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E)`,
        recommendationType: "continue"
      });
    });
    unreadBooks.forEach((book) => {
      let score = 3;
      let reasons = [];
      if (patterns.authors[book.author]) {
        score += 1;
        reasons.push("\u043B\u044E\u0431\u0438\u043C\u044B\u0439 \u0430\u0432\u0442\u043E\u0440");
      }
      if (book.genres && book.genres.some((genre) => patterns.genres[genre])) {
        score += 0.8;
        reasons.push("\u0438\u043D\u0442\u0435\u0440\u0435\u0441\u043D\u044B\u0439 \u0436\u0430\u043D\u0440");
      }
      if (patterns.languages[book.language]) {
        score += 0.3;
      }
      const chapterCount = book.chapters?.length || 0;
      const lengthCategory = chapterCount < 5 ? "short" : chapterCount < 15 ? "medium" : "long";
      const preferredLength = Object.entries(patterns.bookLength).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (preferredLength === lengthCategory) {
        score += 0.5;
        reasons.push("\u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0430\u044F \u0434\u043B\u0438\u043D\u0430");
      }
      const audioCount = books.filter((b) => b.type === "audio").length;
      const textCount = books.filter((b) => b.type === "text").length;
      if (book.type === "audio" && audioCount > textCount) {
        score += 0.4;
        reasons.push("\u0430\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0430");
      } else if (book.type === "text" && textCount > audioCount) {
        score += 0.4;
        reasons.push("\u0442\u0435\u043A\u0441\u0442\u043E\u0432\u0430\u044F \u043A\u043D\u0438\u0433\u0430");
      }
      if (patterns.completionRate < 0.5 && lengthCategory === "short") {
        score += 0.6;
        reasons.push("\u043A\u043E\u0440\u043E\u0442\u043A\u0430\u044F \u043A\u043D\u0438\u0433\u0430");
      }
      const reasonText = reasons.length > 0 ? reasons.join(", ") : "\u043D\u043E\u0432\u0430\u044F \u043A\u043D\u0438\u0433\u0430 \u0434\u043B\u044F \u0432\u0430\u0441";
      recommendations.push({
        ...book,
        id: `unread_${book.id}`,
        recommended: true,
        personalizedScore: score,
        personalizedReason: `\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u043C \u043D\u0430\u0447\u0430\u0442\u044C (${reasonText})`,
        recommendationType: "unread"
      });
    });
    if (completedBooks.length > 0) {
      const favoriteBooks = completedBooks.filter((book) => {
        const bookmarks = readingHistory[book.id]?.bookmarkAdded;
        return bookmarks;
      }).slice(0, 2);
      favoriteBooks.forEach((book) => {
        recommendations.push({
          ...book,
          id: `reread_${book.id}`,
          recommended: true,
          personalizedScore: 2.5,
          personalizedReason: "\u041F\u0435\u0440\u0435\u0447\u0438\u0442\u0430\u0442\u044C \u043B\u044E\u0431\u0438\u043C\u0443\u044E \u043A\u043D\u0438\u0433\u0443",
          recommendationType: "reread"
        });
      });
    }
    return recommendations.sort((a, b) => b.personalizedScore - a.personalizedScore).slice(0, 6);
  }
  updateProfile(action, book) {
    if (!this.userProfile.preferences) {
      this.userProfile.preferences = {};
    }
    if (action === "read" && book.author) {
      this.userProfile.preferences[book.author] = (this.userProfile.preferences[book.author] || 0) + 1;
    }
    if (action === "completed" && book.genres) {
      book.genres.forEach((genre) => {
        this.genreWeights[genre] = (this.genreWeights[genre] || 0) + 2;
      });
    }
    if (action === "liked" && book.author) {
      this.authorPreferences[book.author] = (this.authorPreferences[book.author] || 0) + 3;
    }
    this.userProfile.genreWeights = this.genreWeights;
    this.userProfile.authorPreferences = this.authorPreferences;
    this.userProfile.lastUpdate = Date.now();
    localStorage.setItem("userProfile", JSON.stringify(this.userProfile));
  }
  getReadingInsights(books, readingHistory) {
    const patterns = this.analyzeReadingPattern(books, readingHistory);
    const insights = [];
    const topGenres = Object.entries(patterns.genres).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (topGenres.length > 0) {
      insights.push(`\u0412\u0430\u0448\u0438 \u043B\u044E\u0431\u0438\u043C\u044B\u0435 \u0436\u0430\u043D\u0440\u044B: ${topGenres.map(([genre, count]) => `${genre} (${count} \u043A\u043D\u0438\u0433)`).join(", ")}`);
    }
    const topAuthors = Object.entries(patterns.authors).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (topAuthors.length > 0) {
      insights.push(`\u041F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u0435\u043C\u044B\u0435 \u0430\u0432\u0442\u043E\u0440\u044B: ${topAuthors.map(([author, count]) => `${author} (${count} \u043A\u043D\u0438\u0433)`).join(", ")}`);
    }
    const topReadingTimes = Object.entries(patterns.readingTime).sort((a, b) => b[1] - a[1]).slice(0, 2);
    if (topReadingTimes.length > 0) {
      const timeRanges = topReadingTimes.map(([hour, count]) => {
        const hourNum = parseInt(hour);
        if (hourNum >= 6 && hourNum < 12) return "\u0443\u0442\u0440\u043E\u043C";
        if (hourNum >= 12 && hourNum < 18) return "\u0434\u043D\u0435\u043C";
        if (hourNum >= 18 && hourNum < 22) return "\u0432\u0435\u0447\u0435\u0440\u043E\u043C";
        return "\u043D\u043E\u0447\u044C\u044E";
      });
      insights.push(`\u041F\u0440\u0435\u0434\u043F\u043E\u0447\u0438\u0442\u0430\u0435\u0442\u0435 \u0447\u0438\u0442\u0430\u0442\u044C: ${timeRanges.join(", ")}`);
    }
    if (patterns.completionRate > 0.8) {
      insights.push("\u0412\u044B \u0434\u043E\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0435 \u0431\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u043E \u043D\u0430\u0447\u0430\u0442\u044B\u0445 \u043A\u043D\u0438\u0433 - \u043E\u0442\u043B\u0438\u0447\u043D\u0430\u044F \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u0430!");
    } else if (patterns.completionRate > 0.5) {
      insights.push("\u0421\u0442\u0430\u0440\u0430\u0435\u0442\u0435\u0441\u044C \u0434\u043E\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C \u043A\u043D\u0438\u0433\u0438 \u0434\u043E \u043A\u043E\u043D\u0446\u0430, \u043D\u043E \u0438\u043D\u043E\u0433\u0434\u0430 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0435\u0441\u044C \u043D\u0430 \u043D\u043E\u0432\u044B\u0435");
    } else {
      insights.push("\u041B\u044E\u0431\u0438\u0442\u0435 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0435 \u043A\u043D\u0438\u0433\u0438 - \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0432\u044B\u0431\u0438\u0440\u0430\u0442\u044C \u0431\u043E\u043B\u0435\u0435 \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F");
    }
    return insights;
  }
};
var LiquidGlassLibrary = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @media (min-width: 475px) {
        .xs\\:block { display: block !important; }
        .xs\\:flex { display: flex !important; }
        .xs\\:hidden { display: none !important; }
        .xs\\:inline { display: inline !important; }
      }
      
      /* \u0423\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0438 \u043D\u0430 \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0445 */
      .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      
      .overflow-x-auto::-webkit-scrollbar {
        display: none;
      }
      
      /* \u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u0430\u044F \u0432\u044B\u0441\u043E\u0442\u0430 \u0434\u043B\u044F \u043C\u043E\u0431\u0438\u043B\u044C\u043D\u044B\u0445 */
      @media (max-height: 600px) {
        .max-h-\\[95vh\\] {
          max-height: 100vh !important;
        }
      }
      
      /* \u0423\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435 \u0442\u0430\u0447 \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 */
      .touch-target {
        min-height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* \u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0430\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u044B\u0435 \u0440\u0430\u0437\u043C\u0435\u0440\u044B */
      @media (max-width: 640px) {
        .touch-target {
          min-height: 40px;
          min-width: 40px;
        }
      }
      
      /* \u0423\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435 \u0447\u0438\u0442\u0430\u0435\u043C\u043E\u0441\u0442\u0438 \u043D\u0430 \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0445 \u044D\u043A\u0440\u0430\u043D\u0430\u0445 */
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
  const [books, setBooks] = useStoredState("books", []);
  const [currentView, setCurrentView] = useState("library");
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const isDarkMode = true;
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [ttsSettings, setTtsSettings] = useStoredState("ttsSettings", {
    voice: "",
    rate: 1,
    pitch: 1,
    volume: 1
  });
  const [ttsVoices, setTtsVoices] = useState([]);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState("file");
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [importExportProgress, setImportExportProgress] = useState(null);
  const [importStrategy, setImportStrategy] = useState("merge");
  const [lastExportInfo, setLastExportInfo] = useState(null);
  const [audioUrls, setAudioUrls] = useState("");
  const [audioBookTitle, setAudioBookTitle] = useState("");
  const [audioBookAuthor, setAudioBookAuthor] = useState("");
  const [audioLoadProgress, setAudioLoadProgress] = useState(null);
  const [bookmarks, setBookmarks] = useStoredState("bookmarks", {});
  const [readingStats, setReadingStats] = useStoredState("readingStats", {});
  const [achievements, setAchievements] = useStoredState("achievements", {});
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const ttsManagerRef = useRef(null);
  const aiAssistantRef = useRef(null);
  const recommendationEngineRef = useRef(null);
  useEffect(() => {
    ttsManagerRef.current = new TTSManager();
    aiAssistantRef.current = new AIAssistant();
    recommendationEngineRef.current = new RecommendationEngine();
    initializeTTS();
    if (!aiAssistantRef.current.apiKey) {
      console.warn("\u26A0\uFE0F API \u043A\u043B\u044E\u0447 OpenRouter \u043D\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D. \u0418\u0418 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 \u0431\u0443\u0434\u0443\u0442 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u044B.");
      console.info('\u{1F4A1} \u0414\u043B\u044F \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u0418\u0418 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u043A\u043B\u044E\u0447 \u0447\u0435\u0440\u0435\u0437: localStorage.setItem("openrouter_api_key", "\u0432\u0430\u0448_\u043A\u043B\u044E\u0447")');
    }
  }, []);
  const initializeTTS = async () => {
    const voices = await ttsManagerRef.current.initVoices();
    setTtsVoices(voices);
    ttsManagerRef.current.setCallbacks({
      onSentenceStart: (index, text) => {
        setCurrentSentence(index);
      },
      onSentenceEnd: (index) => {
        updateReadingProgress();
      },
      onEnd: () => {
        setIsTTSPlaying(false);
        setCurrentSentence(0);
      }
    });
  };
  const handleExportLibrary = async () => {
    try {
      setImportExportProgress({ status: "exporting", progress: 0, message: "\u041F\u043E\u0434\u0433\u043E\u0442\u0430\u0432\u043B\u0438\u0432\u0430\u044E \u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043B\u044F \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430..." });
      const userSettings = {
        darkMode: isDarkMode,
        ttsSettings
      };
      setImportExportProgress({ status: "exporting", progress: 50, message: "\u0421\u043E\u0437\u0434\u0430\u044E \u0444\u0430\u0439\u043B \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430..." });
      const exportResult = await LibraryManager.exportLibrary(
        books,
        readingStats,
        bookmarks,
        achievements,
        userSettings
      );
      setLastExportInfo(exportResult);
      setImportExportProgress({
        status: "completed",
        progress: 100,
        message: `\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D! \u0424\u0430\u0439\u043B: ${exportResult.fileName}`
      });
      setTimeout(() => {
        setImportExportProgress(null);
        setShowImportExportModal(false);
      }, 3e3);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430:", error);
      setImportExportProgress({
        status: "error",
        progress: 0,
        message: `\u041E\u0448\u0438\u0431\u043A\u0430 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430: ${error.message}`
      });
      setTimeout(() => {
        setImportExportProgress(null);
      }, 5e3);
    }
  };
  const handleImportLibrary = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      setImportExportProgress({ status: "importing", progress: 0, message: "\u041D\u0430\u0447\u0438\u043D\u0430\u044E \u0438\u043C\u043F\u043E\u0440\u0442 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438..." });
      const importResult = await LibraryManager.importLibrary(file, (progress) => {
        setImportExportProgress((prev) => ({ ...prev, ...progress }));
      });
      if (importResult.success) {
        const mergedBooks = await LibraryManager.mergeWithExistingLibrary(
          books,
          importResult.data.books,
          importStrategy
        );
        setBooks(mergedBooks);
        if (importStrategy === "replace") {
          setReadingStats(importResult.data.readingStats);
          setBookmarks(importResult.data.bookmarks);
          setAchievements(importResult.data.achievements);
          if (importResult.data.userSettings.darkMode !== void 0) {
            setIsDarkMode(importResult.data.userSettings.darkMode);
          }
          if (importResult.data.userSettings.ttsSettings) {
            setTtsSettings(importResult.data.userSettings.ttsSettings);
          }
        } else {
          setReadingStats((prev) => ({ ...prev, ...importResult.data.readingStats }));
          setBookmarks((prev) => ({ ...prev, ...importResult.data.bookmarks }));
          setAchievements((prev) => ({ ...prev, ...importResult.data.achievements }));
        }
        setImportExportProgress({
          status: "completed",
          progress: 100,
          message: `\u0418\u043C\u043F\u043E\u0440\u0442 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D! \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E ${importResult.importStats.booksImported} \u043A\u043D\u0438\u0433`
        });
        setTimeout(() => {
          setImportExportProgress(null);
          setShowImportExportModal(false);
        }, 3e3);
      }
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043C\u043F\u043E\u0440\u0442\u0430:", error);
      setImportExportProgress({
        status: "error",
        progress: 0,
        message: `\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043C\u043F\u043E\u0440\u0442\u0430: ${error.message}`
      });
      setTimeout(() => {
        setImportExportProgress(null);
      }, 5e3);
    }
    event.target.value = "";
  };
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setShowUploadModal(false);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = `file_${Date.now()}_${i}`;
      try {
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { status: "parsing", progress: 0, message: "\u041D\u0430\u0447\u0438\u043D\u0430\u044E \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443...", fileName: file.name }
        }));
        const bookData = await AdvancedFileParser.parseFile(file, (progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: { ...prev[fileId], ...progress, fileName: file.name }
          }));
        });
        const quality = AdvancedFileParser.analyzeParsingQuality(bookData);
        const newBook = {
          id: `book_${Date.now()}_${Math.random()}`,
          ...bookData,
          type: "text",
          addedDate: (/* @__PURE__ */ new Date()).toISOString(),
          progress: 0,
          currentChapter: 0,
          cover: `keys/book-cover-${encodeURIComponent(bookData.title)}?prompt=${encodeURIComponent(bookData.title + " book cover classic literature")}`,
          parsingQuality: quality,
          language: bookData.language || AdvancedFileParser.detectLanguageAdvanced(bookData.chapters?.map((ch) => ch.content).join(" ") || ""),
          detectedGenres: bookData.detectedGenres || []
        };
        setBooks((prev) => [...prev, newBook]);
        updateReadingStats(newBook.id, { added: true });
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { status: "completed", progress: 100, message: "\u041A\u043D\u0438\u0433\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430!", fileName: file.name }
        }));
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 3e3);
      } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0444\u0430\u0439\u043B\u0430:", error);
        setUploadProgress((prev) => ({
          ...prev,
          [fileId]: { status: "error", progress: 0, message: `\u041E\u0448\u0438\u0431\u043A\u0430: ${error.message}`, fileName: file.name }
        }));
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 5e3);
      }
    }
    event.target.value = "";
  };
  const handleAudioUpload = async (event) => {
    const files = Array.from(event.target.files);
    setShowUploadModal(false);
    if (files.length === 0) return;
    const audioBook = {
      id: `audiobook_${Date.now()}`,
      title: audioBookTitle || `\u0410\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0430 ${files.length} \u0433\u043B\u0430\u0432`,
      author: audioBookAuthor || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440",
      type: "audio",
      chapters: files.map((file, index) => ({
        title: `\u0413\u043B\u0430\u0432\u0430 ${index + 1}`,
        url: URL.createObjectURL(file),
        duration: 0,
        size: file.size
      })),
      addedDate: (/* @__PURE__ */ new Date()).toISOString(),
      progress: 0,
      currentChapter: 0,
      cover: "assets/audiobook-cover.png?prompt=audiobook%20headphones%20sound%20waves%20modern%20design",
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    };
    setBooks((prev) => [...prev, audioBook]);
    updateReadingStats(audioBook.id, { added: true });
    setAudioBookTitle("");
    setAudioBookAuthor("");
    event.target.value = "";
  };
  const handleAudioUrlsLoad = async () => {
    if (!audioUrls.trim()) return;
    const urls = audioUrls.split("\n").filter((url) => url.trim());
    if (urls.length === 0) {
      alert("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 URL \u0430\u0434\u0440\u0435\u0441\u0430");
      return;
    }
    try {
      setAudioLoadProgress({ status: "loading", current: 0, total: urls.length });
      const chapters = await AudioBookLoader.loadMultipleFromURLs(urls, (progress) => {
        setAudioLoadProgress((prev) => ({ ...prev, ...progress }));
      });
      if (chapters.length === 0) {
        alert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043D\u0438 \u043E\u0434\u043D\u043E\u0433\u043E \u0430\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B\u0430");
        return;
      }
      const audioBook = await AudioBookLoader.createAudioBook(
        chapters,
        audioBookTitle || `\u0410\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0430 ${chapters.length} \u0433\u043B\u0430\u0432`,
        audioBookAuthor || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440"
      );
      setBooks((prev) => [...prev, audioBook]);
      updateReadingStats(audioBook.id, { added: true });
      setAudioUrls("");
      setAudioBookTitle("");
      setAudioBookAuthor("");
      setShowUploadModal(false);
      setAudioLoadProgress({ status: "completed", current: chapters.length, total: urls.length });
      setTimeout(() => {
        setAudioLoadProgress(null);
      }, 3e3);
    } catch (error) {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0430\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0438:", error);
      setAudioLoadProgress({ status: "error", error: error.message });
      setTimeout(() => {
        setAudioLoadProgress(null);
      }, 5e3);
    }
  };
  const addBookmark = (note = "") => {
    if (!selectedBook) return;
    const bookmark = {
      id: `bookmark_${Date.now()}`,
      bookId: selectedBook.id,
      chapterIndex: currentChapter,
      timestamp: Date.now(),
      note,
      type: selectedBook.type
    };
    if (selectedBook.type === "audio") {
      bookmark.audioTime = currentTime;
    } else {
      bookmark.scrollPosition = window.scrollY;
      bookmark.sentenceIndex = currentSentence;
    }
    setBookmarks((prev) => ({
      ...prev,
      [selectedBook.id]: [...prev[selectedBook.id] || [], bookmark]
    }));
    updateReadingStats(selectedBook.id, { bookmarkAdded: true });
  };
  const goToBookmark = (bookmark) => {
    const book = books.find((b) => b.id === bookmark.bookId);
    if (!book) return;
    setSelectedBook(book);
    setCurrentChapter(bookmark.chapterIndex);
    setCurrentView(book.type === "audio" ? "audio" : "reader");
    if (book.type === "audio" && bookmark.audioTime) {
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
  const updateReadingStats = (bookId, update) => {
    setReadingStats((prev) => ({
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
    if (selectedBook.type === "text") {
      const chapterProgress = (currentChapter + 1) / selectedBook.chapters.length;
      const sentenceProgress = sentences.length > 0 ? (currentSentence + 1) / sentences.length : 0;
      progress = (chapterProgress + sentenceProgress / selectedBook.chapters.length) * 100;
    } else if (selectedBook.type === "audio") {
      const chapterProgress = (currentChapter + 1) / selectedBook.chapters.length;
      const timeProgress = duration > 0 ? currentTime / duration : 0;
      progress = (chapterProgress + timeProgress / selectedBook.chapters.length) * 100;
    }
    progress = Math.min(Math.max(progress, 0), 100);
    updateReadingStats(selectedBook.id, { progress });
    setBooks((prev) => prev.map(
      (book) => book.id === selectedBook.id ? { ...book, progress, currentChapter } : book
    ));
  };
  const checkAchievements = () => {
    const stats = calculateStats();
    const newAchievements = {};
    if (stats.totalBooks >= 10) newAchievements.collector = true;
    if (stats.completedBooks >= 5) newAchievements.reader = true;
    if (stats.totalBookmarks >= 50) newAchievements.bookmarker = true;
    if (stats.booksThisMonth >= 3) newAchievements.active = true;
    if (stats.totalWords >= 1e5) newAchievements.wordMaster = true;
    if (stats.readingStreak >= 7) newAchievements.consistent = true;
    setAchievements(newAchievements);
  };
  const calculateStats = () => {
    const now = /* @__PURE__ */ new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const totalBooks = books.length;
    const completedBooks = books.filter((book) => {
      const progress = readingStats[book.id]?.progress || 0;
      return progress >= 100;
    }).length;
    const totalBookmarks = Object.values(bookmarks).flat().length;
    const booksThisMonth = books.filter(
      (book) => new Date(book.addedDate) >= thisMonth
    ).length;
    const booksInProgress = books.filter((book) => {
      const progress = readingStats[book.id]?.progress || 0;
      return progress > 0 && progress < 100;
    }).length;
    const totalWords = books.reduce((sum, book) => sum + (book.wordCount || 0), 0);
    const readingDays = Object.values(readingStats).filter((stat) => stat.lastRead).map((stat) => new Date(stat.lastRead).toDateString()).filter((date, index, array) => array.indexOf(date) === index).sort().reverse();
    let readingStreak = 0;
    for (let i = 0; i < readingDays.length; i++) {
      const date = new Date(readingDays[i]);
      const expectedDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1e3);
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
  const handleAIMessage = async () => {
    if (!aiInput.trim()) return;
    const userMessage = aiInput.trim();
    setAiInput("");
    setAiMessages((prev) => [...prev, { type: "user", content: userMessage, timestamp: Date.now() }]);
    setAiLoading(true);
    try {
      const response = await aiAssistantRef.current.generateResponse(userMessage, books);
      const cleanedResponse = response.text.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<thinking>[\s\S]*?<\/thinking>/g, "").replace(/^\s+|\s+$/g, "").trim();
      const aiMessage = {
        type: "ai",
        content: cleanedResponse,
        source: response.source,
        confidence: response.confidence,
        suggestions: response.suggestions,
        relatedQuestions: response.relatedQuestions,
        timestamp: Date.now(),
        id: `ai_${Date.now()}_${Math.random()}`
      };
      setAiMessages((prev) => [...prev, aiMessage]);
      setTimeout(() => {
        speakAIResponse(cleanedResponse, aiMessage.id);
      }, 500);
      aiAssistantRef.current.learnFromInteraction(userMessage, response.text, selectedBook?.title);
    } catch (error) {
      const errorMessage = {
        type: "ai",
        content: "\u0418\u0437\u0432\u0438\u043D\u0438\u0442\u0435, \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0435 \u0432\u0430\u0448\u0435\u0433\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0430. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0435 \u0440\u0430\u0437.",
        timestamp: Date.now(),
        id: `ai_error_${Date.now()}`
      };
      setAiMessages((prev) => [...prev, errorMessage]);
      setTimeout(() => {
        speakAIResponse(errorMessage.content, errorMessage.id);
      }, 500);
    }
    setAiLoading(false);
  };
  const speakAIResponse = (text, messageId) => {
    const aiTtsEnabled = localStorage.getItem("aiTtsEnabled") !== "false";
    if (!aiTtsEnabled) return;
    if (ttsManagerRef.current.isPlaying) {
      ttsManagerRef.current.stop();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const aiVoice = ttsVoices.find(
      (v) => v.lang.startsWith("ru") && (v.name.toLowerCase().includes("elena") || v.name.toLowerCase().includes("maria") || v.name.toLowerCase().includes("female"))
    ) || ttsVoices.find((v) => v.lang.startsWith("ru")) || ttsVoices[0];
    if (aiVoice) utterance.voice = aiVoice;
    utterance.rate = 1.1;
    utterance.pitch = 1.1;
    utterance.volume = ttsSettings.volume || 1;
    setAiMessages((prev) => prev.map(
      (msg) => msg.id === messageId ? { ...msg, isPlaying: true } : { ...msg, isPlaying: false }
    ));
    utterance.onstart = () => {
      console.log("\u041E\u0437\u0432\u0443\u0447\u043A\u0430 \u0418\u0418 \u043D\u0430\u0447\u0430\u043B\u0430\u0441\u044C");
    };
    utterance.onend = () => {
      setAiMessages((prev) => prev.map(
        (msg) => msg.id === messageId ? { ...msg, isPlaying: false } : msg
      ));
    };
    utterance.onerror = (event) => {
      console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0437\u0432\u0443\u0447\u043A\u0438 \u0418\u0418:", event.error);
      setAiMessages((prev) => prev.map(
        (msg) => msg.id === messageId ? { ...msg, isPlaying: false } : msg
      ));
    };
    window.speechSynthesis.speak(utterance);
  };
  const stopAIVoice = () => {
    window.speechSynthesis.cancel();
    setAiMessages((prev) => prev.map((msg) => ({ ...msg, isPlaying: false })));
  };
  const toggleAITTS = () => {
    const currentEnabled = localStorage.getItem("aiTtsEnabled") !== "false";
    const newEnabled = !currentEnabled;
    localStorage.setItem("aiTtsEnabled", newEnabled.toString());
    if (!newEnabled) {
      stopAIVoice();
    }
  };
  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem("openrouter_api_key", tempApiKey.trim());
      if (aiAssistantRef.current) {
        aiAssistantRef.current.apiKey = tempApiKey.trim();
      }
      setShowApiKeyModal(false);
      setTempApiKey("");
      setAiMessages((prev) => [...prev, {
        type: "ai",
        content: "\u2705 API \u043A\u043B\u044E\u0447 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D! \u0422\u0435\u043F\u0435\u0440\u044C \u044F \u0433\u043E\u0442\u043E\u0432 \u043E\u0442\u0432\u0435\u0447\u0430\u0442\u044C \u043D\u0430 \u0432\u0430\u0448\u0438 \u0432\u043E\u043F\u0440\u043E\u0441\u044B.",
        timestamp: Date.now(),
        id: `ai_success_${Date.now()}`
      }]);
    }
  };
  const handleRemoveApiKey = () => {
    localStorage.removeItem("openrouter_api_key");
    if (aiAssistantRef.current) {
      aiAssistantRef.current.apiKey = "";
    }
    setShowApiKeyModal(false);
    setTempApiKey("");
    setAiMessages((prev) => [...prev, {
      type: "ai",
      content: "\u{1F511} API \u043A\u043B\u044E\u0447 \u0443\u0434\u0430\u043B\u0435\u043D. \u0414\u043B\u044F \u043F\u043E\u043B\u043D\u043E\u0446\u0435\u043D\u043D\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u0418\u0418 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u044B\u0439 \u043A\u043B\u044E\u0447.",
      timestamp: Date.now(),
      id: `ai_removed_${Date.now()}`
    }]);
  };
  const openApiKeyModal = () => {
    const currentKey = localStorage.getItem("openrouter_api_key") || "";
    setTempApiKey(currentKey);
    setShowApiKeyModal(true);
  };
  const startTTS = () => {
    if (!selectedBook || selectedBook.type !== "text") return;
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
      if (selectedBook.type === "audio" && audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      if (isTTSPlaying) {
        stopTTS();
      }
      updateReadingProgress();
    }
  };
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query) || book.genres && book.genres.some((genre) => genre.toLowerCase().includes(query));
  });
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const renderLibrary = () => /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-white/20 p-4 sm:p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 18 }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "\u041F\u043E\u0438\u0441\u043A \u043A\u043D\u0438\u0433...",
      value: searchQuery,
      onChange: (e) => setSearchQuery(e.target.value),
      className: "w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setUploadType("file");
        setShowUploadModal(true);
      },
      className: "group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 text-white rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 font-medium"
    },
    /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
    /* @__PURE__ */ React.createElement("div", { className: "relative flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-white/20 rounded-xl group-hover:rotate-6 transition-transform duration-300" }, /* @__PURE__ */ React.createElement(Plus, { size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-bold" }, "\u{1F4DA} \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043D\u0438\u0433\u0443"), /* @__PURE__ */ React.createElement("div", { className: "text-sm opacity-90" }, "EPUB, FB2, TXT, PDF")))
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setUploadType("audio");
        setShowUploadModal(true);
      },
      className: "group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 font-medium"
    },
    /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
    /* @__PURE__ */ React.createElement("div", { className: "relative flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-white/20 rounded-xl group-hover:rotate-6 transition-transform duration-300" }, /* @__PURE__ */ React.createElement(Headphones, { size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-bold" }, "\u{1F3A7} \u0410\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0430"), /* @__PURE__ */ React.createElement("div", { className: "text-sm opacity-90" }, "MP3, WAV, OGG")))
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowImportExportModal(true),
      className: "group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 text-white rounded-2xl hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 font-medium"
    },
    /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
    /* @__PURE__ */ React.createElement("div", { className: "relative flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-white/20 rounded-xl group-hover:rotate-6 transition-transform duration-300" }, /* @__PURE__ */ React.createElement(Download, { size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "text-lg font-bold" }, "\u{1F4BE} \u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430"), /* @__PURE__ */ React.createElement("div", { className: "text-sm opacity-90" }, "\u0418\u043C\u043F\u043E\u0440\u0442/\u042D\u043A\u0441\u043F\u043E\u0440\u0442")))
  )))), Object.keys(uploadProgress).length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0444\u0430\u0439\u043B\u043E\u0432"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, Object.entries(uploadProgress).map(([fileId, progress]) => /* @__PURE__ */ React.createElement("div", { key: fileId, className: "bg-white/5 rounded-lg p-2 sm:p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-white text-xs sm:text-sm font-medium truncate flex-1 mr-2" }, progress.fileName), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, progress.status === "parsing" && /* @__PURE__ */ React.createElement(Loader, { className: "animate-spin text-blue-400", size: 16 }), progress.status === "completed" && /* @__PURE__ */ React.createElement(Check, { className: "text-green-400", size: 16 }), progress.status === "error" && /* @__PURE__ */ React.createElement(AlertCircle, { className: "text-red-400", size: 16 }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-300" }, progress.progress, "%"))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-gray-700 rounded-full h-2 mb-2" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `h-2 rounded-full transition-all duration-300 ${progress.status === "error" ? "bg-red-500" : progress.status === "completed" ? "bg-green-500" : "bg-blue-500"}`,
      style: { width: `${progress.progress}%` }
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, progress.message))))), audioLoadProgress && /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-white/20 p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-white mb-4" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0430\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0438"), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-lg p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-white text-sm font-medium" }, audioLoadProgress.status === "loading" ? "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E \u0433\u043B\u0430\u0432\u044B..." : audioLoadProgress.status === "completed" ? "\u0410\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0430!" : "\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, audioLoadProgress.status === "loading" && /* @__PURE__ */ React.createElement(Loader, { className: "animate-spin text-blue-400", size: 16 }), audioLoadProgress.status === "completed" && /* @__PURE__ */ React.createElement(Check, { className: "text-green-400", size: 16 }), audioLoadProgress.status === "error" && /* @__PURE__ */ React.createElement(AlertCircle, { className: "text-red-400", size: 16 }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-300" }, audioLoadProgress.current, "/", audioLoadProgress.total))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-gray-700 rounded-full h-2 mb-2" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `h-2 rounded-full transition-all duration-300 ${audioLoadProgress.status === "error" ? "bg-red-500" : audioLoadProgress.status === "completed" ? "bg-green-500" : "bg-blue-500"}`,
      style: { width: `${audioLoadProgress.current / audioLoadProgress.total * 100}%` }
    }
  )), audioLoadProgress.error && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-red-400" }, audioLoadProgress.error))), books.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-white/20 p-4 sm:p-6 shadow-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl" }), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4 sm:mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg" }, /* @__PURE__ */ React.createElement(Star, { className: "text-white", size: 20 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg sm:text-xl font-bold text-white" }, "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u0434\u043B\u044F \u0432\u0430\u0441"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-300" }, "\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u043E \u043F\u043E\u0434\u043E\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043A\u043D\u0438\u0433\u0438"))), /* @__PURE__ */ React.createElement("div", { className: "hidden sm:flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "text-yellow-400 animate-pulse", size: 16 }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-yellow-300 font-medium" }, "\u0418\u0418 \u043F\u043E\u0434\u0431\u043E\u0440\u043A\u0430"))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-1 px-1 touch-pan-x scrollbar-hide" }, recommendationEngineRef.current?.generateRecommendations(books, readingStats).slice(0, 6).map((rec, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: rec.id,
      className: "group flex-shrink-0 w-44 sm:w-52 cursor-pointer touch-target",
      onClick: () => {
        setSelectedBook(books.find((b) => b.id === rec.id.replace(/^(continue_|unread_|reread_)/, "")));
        setCurrentChapter(rec.currentChapter || 0);
        setCurrentView(rec.type === "audio" ? "audio" : "reader");
      },
      style: { animationDelay: `${index * 100}ms` }
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/25 group-hover:border-purple-400/40" }, /* @__PURE__ */ React.createElement("div", { className: "relative aspect-[3/4] overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400" }), /* @__PURE__ */ React.createElement(
      "img",
      {
        src: rec.cover,
        alt: rec.title,
        className: "relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
        onError: (e) => {
          e.target.style.display = "none";
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 left-2" }, rec.recommendationType === "continue" && /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse" }, /* @__PURE__ */ React.createElement(Play, { size: 10 }), "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C"), rec.recommendationType === "unread" && /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg" }, /* @__PURE__ */ React.createElement(BookOpen, { size: 10 }), "\u041D\u043E\u0432\u0438\u043D\u043A\u0430"), rec.recommendationType === "reread" && /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg" }, /* @__PURE__ */ React.createElement(RefreshCw, { size: 10 }), "\u041F\u0435\u0440\u0435\u0447\u0438\u0442\u0430\u0442\u044C")), /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Star, { className: "text-yellow-400 fill-yellow-400", size: 10 }), /* @__PURE__ */ React.createElement("span", { className: "text-white text-xs font-bold" }, rec.personalizedScore?.toFixed(1))), rec.recommendationType === "continue" && /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000",
        style: { width: `${readingStats[rec.id.replace("continue_", "")]?.progress || 0}%` }
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-2 right-2" }, /* @__PURE__ */ React.createElement("div", { className: `p-1.5 rounded-full backdrop-blur-sm border border-white/20 ${rec.type === "audio" ? "bg-green-500/80 text-white" : "bg-blue-500/80 text-white"}` }, rec.type === "audio" ? /* @__PURE__ */ React.createElement(Headphones, { size: 12 }) : /* @__PURE__ */ React.createElement(BookOpen, { size: 12 })))), /* @__PURE__ */ React.createElement("div", { className: "p-3 space-y-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-sm leading-tight line-clamp-2 group-hover:text-purple-200 transition-colors duration-300" }, rec.title), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 text-xs line-clamp-1" }, rec.author), /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-1 h-1 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" }), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-purple-300 line-clamp-2 leading-relaxed" }, rec.personalizedReason)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pt-2 border-t border-white/10" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Activity, { size: 10, className: "text-green-400" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-green-300 font-medium" }, rec.recommendationType === "continue" ? "\u0412 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435" : rec.recommendationType === "unread" ? "\u041D\u0435 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E" : "\u0414\u043B\u044F \u043F\u043E\u0432\u0442\u043E\u0440\u0430")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Heart, { size: 10, className: "text-red-400" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-red-300" }, Math.round(rec.personalizedScore * 20), "%")))), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
        style: { background: "linear-gradient(45deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3), rgba(59,130,246,0.3))" }
      }
    ))
  ))), recommendationEngineRef.current?.generateRecommendations(books, readingStats).length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-12" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl" }, /* @__PURE__ */ React.createElement(Star, { className: "text-white animate-pulse", size: 32 })), /* @__PURE__ */ React.createElement("div", { className: "absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Sparkles, { className: "text-white", size: 12 }))), /* @__PURE__ */ React.createElement("h4", { className: "text-lg font-bold text-white mb-2" }, "\u0413\u043E\u0442\u043E\u0432\u0438\u043C \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-300 max-w-md mx-auto" }, "\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0447\u0438\u0442\u0430\u0442\u044C \u043A\u043D\u0438\u0433\u0438, \u0438 \u043D\u0430\u0448 \u0418\u0418 \u0441\u043E\u0437\u0434\u0430\u0441\u0442 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0432\u0430\u0448\u0438\u0445 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0435\u043D\u0438\u0439")))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6" }, filteredBooks.map((book) => {
    const bookStats = readingStats[book.id] || {};
    const progress = bookStats.progress || 0;
    const bookBookmarks = bookmarks[book.id] || [];
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: book.id,
        className: "group bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer",
        onClick: () => {
          setSelectedBook(book);
          setCurrentChapter(book.currentChapter || 0);
          setCurrentView(book.type === "audio" ? "audio" : "reader");
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "aspect-[2/3] rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 mb-3 sm:mb-4 relative overflow-hidden" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: book.cover,
          alt: book.title,
          className: "w-full h-full object-cover",
          onError: (e) => {
            e.target.style.display = "none";
          }
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between" }, /* @__PURE__ */ React.createElement("div", { className: `px-2 sm:px-3 py-1 sm:py-1.5 rounded sm:rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ${book.type === "audio" ? "bg-green-500/90 text-white" : "bg-blue-500/90 text-white"}` }, book.type === "audio" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Headphones, { size: 12, className: "sm:w-4 sm:h-4" }), /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "\u{1F3A7}")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BookOpen, { size: 12, className: "sm:w-4 sm:h-4" }), /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "\u{1F4D6}"))), bookBookmarks.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-red-500 text-white text-xs sm:text-sm rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center font-bold" }, bookBookmarks.length > 9 ? "9+" : bookBookmarks.length)), book.language && /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-2 sm:bottom-3 left-2 sm:left-3" }, /* @__PURE__ */ React.createElement("div", { className: "bg-black/70 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded sm:rounded-lg text-xs sm:text-sm" }, book.language.toUpperCase()))),
      /* @__PURE__ */ React.createElement("div", { className: "space-y-2 flex-1 flex flex-col" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-white text-sm sm:text-base line-clamp-2 leading-tight flex-grow" }, book.title), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 text-xs sm:text-sm line-clamp-1" }, book.author), /* @__PURE__ */ React.createElement("div", { className: "mt-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs text-gray-400 mb-1" }, /* @__PURE__ */ React.createElement("span", { className: "truncate" }, (book.currentChapter || 0) + 1, "/", book.chapters?.length || 0), /* @__PURE__ */ React.createElement("span", { className: "flex-shrink-0 ml-2 font-medium text-white" }, Math.round(progress), "%")), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-gray-700 rounded-full h-1.5 sm:h-2" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 sm:h-2 rounded-full transition-all duration-300",
          style: { width: `${progress}%` }
        }
      ))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-1.5" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            setSelectedBook(book);
            setCurrentView(book.type === "audio" ? "audio" : "reader");
          },
          className: "group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-2 sm:p-2.5 rounded-lg font-bold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105 active:scale-95",
          title: book.type === "audio" ? "\u0421\u043B\u0443\u0448\u0430\u0442\u044C" : "\u0427\u0438\u0442\u0430\u0442\u044C"
        },
        /* @__PURE__ */ React.createElement("div", { className: "relative" }, book.type === "audio" ? /* @__PURE__ */ React.createElement(Headphones, { size: 14, className: "sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" }) : /* @__PURE__ */ React.createElement(BookOpen, { size: 14, className: "sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" }))
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            setEditingBook(book);
            setShowEditModal(true);
          },
          className: "group relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white p-2 sm:p-2.5 rounded-lg font-bold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/25 hover:scale-105 active:scale-95",
          title: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C"
        },
        /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Edit3, { size: 14, className: "sm:w-4 sm:h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" }))
      )))
    );
  })), filteredBooks.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-8 sm:py-12" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "mx-auto text-gray-400 mb-4", size: 48 }), /* @__PURE__ */ React.createElement("h3", { className: "text-lg sm:text-xl font-semibold text-gray-300 mb-2" }, searchQuery ? "\u041A\u043D\u0438\u0433\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B" : "\u0412\u0430\u0448\u0430 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430 \u043F\u0443\u0441\u0442\u0430"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400 mb-6 text-sm sm:text-base px-4" }, searchQuery ? "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0438\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043E\u0438\u0441\u043A\u043E\u0432\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441" : "\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u043A\u043D\u0438\u0433\u0443, \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u0447\u0438\u0442\u0430\u0442\u044C"), !searchQuery && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setUploadType("file");
        setShowUploadModal(true);
      },
      className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
    },
    "\u{1F4DA} \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043D\u0438\u0433\u0443"
  )));
  const renderReader = () => {
    if (!selectedBook || selectedBook.type !== "text") return null;
    const chapter = selectedBook.chapters[currentChapter];
    if (!chapter) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto space-y-4 sm:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3 sm:gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 sm:gap-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setCurrentView("library"),
        className: "text-gray-400 hover:text-white transition-colors text-sm sm:text-base flex-shrink-0"
      },
      "\u2190 \u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430"
    ), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("h2", { className: "text-base sm:text-lg font-bold text-white truncate" }, selectedBook.title), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 text-sm truncate" }, selectedBook.author), selectedBook.description && /* @__PURE__ */ React.createElement("p", { className: "hidden sm:block text-gray-400 text-xs mt-1 line-clamp-2" }, selectedBook.description.substring(0, 150), "..."))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
      "select",
      {
        value: currentChapter,
        onChange: (e) => setCurrentChapter(Number(e.target.value)),
        className: "bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 flex-1 min-w-0 backdrop-blur-sm"
      },
      selectedBook.chapters.map((ch, index) => /* @__PURE__ */ React.createElement("option", { key: index, value: index, className: "bg-gray-800" }, ch.title.length > 30 ? ch.title.substring(0, 30) + "..." : ch.title))
    ), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => changeChapter(-1),
        disabled: currentChapter === 0,
        className: "group p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm"
      },
      /* @__PURE__ */ React.createElement(SkipBack, { size: 16, className: "group-hover:scale-110 transition-transform" })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => changeChapter(1),
        disabled: currentChapter >= selectedBook.chapters.length - 1,
        className: "group p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm"
      },
      /* @__PURE__ */ React.createElement(SkipForward, { size: 16, className: "group-hover:scale-110 transition-transform" })
    ))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3 sm:gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: isTTSPlaying ? pauseTTS : startTTS,
        className: `group relative overflow-hidden px-6 py-3 rounded-2xl transition-all duration-300 font-medium shadow-lg ${isTTSPlaying ? "bg-gradient-to-r from-orange-500 to-yellow-500 hover:scale-105 hover:shadow-orange-500/25" : "bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 hover:shadow-green-500/25"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: `absolute inset-0 transition-opacity duration-300 ${isTTSPlaying ? "bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100" : "bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100"}` }),
      /* @__PURE__ */ React.createElement("div", { className: "relative flex items-center gap-2" }, isTTSPlaying ? /* @__PURE__ */ React.createElement(Pause, { className: "text-white group-hover:scale-110 transition-transform", size: 18 }) : /* @__PURE__ */ React.createElement(Play, { className: "text-white group-hover:scale-110 transition-transform", size: 18 }), /* @__PURE__ */ React.createElement("span", { className: "text-white font-bold" }, isTTSPlaying ? "\u041F\u0430\u0443\u0437\u0430" : "\u041E\u0437\u0432\u0443\u0447\u0438\u0442\u044C"))
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: stopTTS,
        className: "group relative overflow-hidden p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/25 shadow-lg"
      },
      /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
      /* @__PURE__ */ React.createElement(X, { className: "relative text-white group-hover:scale-110 transition-transform", size: 18 })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => addBookmark(prompt("\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0443 \u043A \u0437\u0430\u043A\u043B\u0430\u0434\u043A\u0435:") || ""),
        className: "group relative overflow-hidden p-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/25 shadow-lg"
      },
      /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
      /* @__PURE__ */ React.createElement(Bookmark, { className: "relative text-white group-hover:scale-110 transition-transform", size: 18 })
    ), /* @__PURE__ */ React.createElement("div", { className: "text-white text-xs sm:text-sm min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "truncate" }, isTTSPlaying ? "\u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0438\u0442\u0441\u044F" : "\u0413\u043E\u0442\u043E\u0432 \u043A \u043E\u0437\u0432\u0443\u0447\u043A\u0435"), sentences.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "text-gray-300 text-xs" }, currentSentence + 1, "/", sentences.length))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full" }, /* @__PURE__ */ React.createElement(
      "select",
      {
        value: ttsSettings.voice,
        onChange: (e) => setTtsSettings({ ...ttsSettings, voice: e.target.value }),
        className: "bg-white/5 border border-white/10 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      },
      /* @__PURE__ */ React.createElement("option", { value: "", className: "bg-gray-800" }, "\u0413\u043E\u043B\u043E\u0441 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E"),
      ttsVoices.filter((voice) => voice.lang.startsWith("ru")).map((voice) => /* @__PURE__ */ React.createElement("option", { key: voice.name, value: voice.name, className: "bg-gray-800" }, voice.name.length > 20 ? voice.name.substring(0, 20) + "..." : voice.name))
    ), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-white text-xs sm:text-sm flex-shrink-0" }, "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "0.5",
        max: "2",
        step: "0.1",
        value: ttsSettings.rate,
        onChange: (e) => {
          const newRate = Number(e.target.value);
          setTtsSettings({ ...ttsSettings, rate: newRate });
          ttsManagerRef.current?.setSpeed(newRate);
        },
        className: "flex-1 min-w-0"
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-gray-300 text-xs flex-shrink-0" }, ttsSettings.rate, "x")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-white text-xs sm:text-sm flex-shrink-0" }, "\u0422\u043E\u043D:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "0.5",
        max: "2",
        step: "0.1",
        value: ttsSettings.pitch,
        onChange: (e) => {
          const newPitch = Number(e.target.value);
          setTtsSettings({ ...ttsSettings, pitch: newPitch });
          ttsManagerRef.current?.setPitch(newPitch);
        },
        className: "flex-1 min-w-0"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Volume2, { className: "text-gray-300 flex-shrink-0", size: 14 }), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "0",
        max: "1",
        step: "0.1",
        value: ttsSettings.volume,
        onChange: (e) => {
          const newVolume = Number(e.target.value);
          setTtsSettings({ ...ttsSettings, volume: newVolume });
          ttsManagerRef.current?.setVolume(newVolume);
        },
        className: "flex-1 min-w-0"
      }
    )))), sentences.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full bg-gray-700 rounded-full h-2" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300",
        style: { width: `${(currentSentence + 1) / sentences.length * 100}%` }
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs text-gray-400 mt-1" }, /* @__PURE__ */ React.createElement("span", null, "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 ", currentSentence + 1, " \u0438\u0437 ", sentences.length), /* @__PURE__ */ React.createElement("span", null, Math.round((currentSentence + 1) / sentences.length * 100), "%")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6" }, chapter.title), /* @__PURE__ */ React.createElement("div", { className: "prose prose-invert max-w-none text-sm sm:text-base leading-relaxed" }, sentences.length > 0 ? sentences.map((sentence, index) => /* @__PURE__ */ React.createElement(
      "span",
      {
        key: index,
        className: `${index === currentSentence && isTTSPlaying ? "bg-yellow-500/30 text-yellow-100 rounded px-1" : index < currentSentence && isTTSPlaying ? "text-green-300" : "text-gray-100"} transition-all duration-300 cursor-pointer hover:bg-purple-500/20`,
        onClick: () => {
          if (isTTSPlaying) {
            stopTTS();
            setCurrentSentence(index);
            setTimeout(() => {
              startTTS();
            }, 100);
          }
        }
      },
      sentence,
      " "
    )) : /* @__PURE__ */ React.createElement("div", { className: "text-gray-100 leading-relaxed whitespace-pre-wrap" }, chapter.content)), /* @__PURE__ */ React.createElement("div", { className: "mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-lg p-2 sm:p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-purple-300 text-xs sm:text-sm" }, "\u0421\u0438\u043C\u0432\u043E\u043B\u043E\u0432"), /* @__PURE__ */ React.createElement("div", { className: "text-white font-bold text-sm sm:text-base" }, chapter.content.length.toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-lg p-2 sm:p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-blue-300 text-xs sm:text-sm" }, "\u0421\u043B\u043E\u0432"), /* @__PURE__ */ React.createElement("div", { className: "text-white font-bold text-sm sm:text-base" }, chapter.content.split(/\s+/).length.toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-lg p-2 sm:p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-green-300 text-xs sm:text-sm" }, "\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0439"), /* @__PURE__ */ React.createElement("div", { className: "text-white font-bold text-sm sm:text-base" }, sentences.length || chapter.content.split(/[.!?]+/).length)), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-lg p-2 sm:p-3" }, /* @__PURE__ */ React.createElement("div", { className: "text-yellow-300 text-xs sm:text-sm" }, "\u0412\u0440\u0435\u043C\u044F \u0447\u0442\u0435\u043D\u0438\u044F"), /* @__PURE__ */ React.createElement("div", { className: "text-white font-bold text-sm sm:text-base" }, Math.ceil(chapter.content.split(/\s+/).length / 200), " \u043C\u0438\u043D"))))));
  };
  const renderAudioPlayer = () => {
    if (!selectedBook || selectedBook.type !== "audio") return null;
    const chapter = selectedBook.chapters[currentChapter];
    if (!chapter) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto space-y-4 sm:space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-3 sm:p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setCurrentView("library"),
        className: "text-gray-400 hover:text-white transition-colors text-sm sm:text-base flex-shrink-0"
      },
      "\u2190 \u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430"
    ), /* @__PURE__ */ React.createElement("div", { className: "text-center min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("h2", { className: "text-base sm:text-lg font-bold text-white truncate" }, selectedBook.title), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 text-sm truncate" }, selectedBook.author), selectedBook.totalSize && /* @__PURE__ */ React.createElement("p", { className: "hidden sm:block text-gray-400 text-xs" }, "\u0420\u0430\u0437\u043C\u0435\u0440: ", formatFileSize(selectedBook.totalSize))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => addBookmark(prompt("\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0443 \u043A \u0437\u0430\u043A\u043B\u0430\u0434\u043A\u0435:") || ""),
        className: "p-1.5 sm:p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors flex-shrink-0"
      },
      /* @__PURE__ */ React.createElement(Bookmark, { className: "text-white", size: 14 })
    ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-6 sm:mb-8" }, /* @__PURE__ */ React.createElement("div", { className: `w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 mb-3 sm:mb-4 relative overflow-hidden ${isPlaying ? "animate-pulse" : ""}` }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: selectedBook.cover,
        alt: selectedBook.title,
        className: "w-full h-full object-cover",
        onError: (e) => {
          e.target.style.display = "none";
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2" }, /* @__PURE__ */ React.createElement("div", { className: "text-white text-xs sm:text-sm font-medium truncate" }, chapter.title), /* @__PURE__ */ React.createElement("div", { className: "text-gray-300 text-xs" }, "\u0413\u043B\u0430\u0432\u0430 ", currentChapter + 1, " \u0438\u0437 ", selectedBook.chapters.length)))), /* @__PURE__ */ React.createElement(
      "audio",
      {
        ref: audioRef,
        src: chapter.url,
        onTimeUpdate: (e) => {
          setCurrentTime(e.target.currentTime);
          updateReadingProgress();
        },
        onDurationChange: (e) => setDuration(e.target.duration),
        onEnded: () => changeChapter(1),
        onPlay: () => setIsPlaying(true),
        onPause: () => setIsPlaying(false),
        onLoadStart: () => console.log("\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0430\u0443\u0434\u0438\u043E..."),
        onCanPlay: () => console.log("\u0410\u0443\u0434\u0438\u043E \u0433\u043E\u0442\u043E\u0432\u043E \u043A \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044E"),
        onError: (e) => console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0430\u0443\u0434\u0438\u043E:", e),
        preload: "metadata"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "mb-4 sm:mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs sm:text-sm text-gray-300 mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "flex-shrink-0" }, formatTime(currentTime)), /* @__PURE__ */ React.createElement("span", { className: "text-center truncate mx-2 hidden sm:inline" }, chapter.title), /* @__PURE__ */ React.createElement("span", { className: "flex-shrink-0" }, formatTime(duration))), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-full bg-gray-700 rounded-full h-3 cursor-pointer relative",
        onClick: (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          seekTo(percent * duration);
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 relative",
          style: { width: `${currentTime / duration * 100 || 0}%` }
        },
        /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" })
      )
    )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-4 mb-6" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => seekTo(Math.max(0, currentTime - 15)),
        className: "group relative p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-110",
        title: "\u041D\u0430\u0437\u0430\u0434 \u043D\u0430 15 \u0441\u0435\u043A"
      },
      /* @__PURE__ */ React.createElement(SkipBack, { size: 18, className: "group-hover:scale-110 transition-transform" }),
      /* @__PURE__ */ React.createElement("span", { className: "absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" }, "-15\u0441")
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => changeChapter(-1),
        disabled: currentChapter === 0,
        className: "group relative p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-110 disabled:hover:scale-100",
        title: "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0430\u044F \u0433\u043B\u0430\u0432\u0430"
      },
      /* @__PURE__ */ React.createElement(SkipBack, { size: 16, className: "group-hover:scale-110 transition-transform" })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: togglePlayback,
        className: "group relative overflow-hidden p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
      },
      /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
      /* @__PURE__ */ React.createElement("div", { className: "relative" }, isPlaying ? /* @__PURE__ */ React.createElement(Pause, { size: 24 }) : /* @__PURE__ */ React.createElement(Play, { size: 24, className: "ml-1" })),
      isPlaying && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 rounded-full bg-purple-500/40 animate-ping" })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => changeChapter(1),
        disabled: currentChapter >= selectedBook.chapters.length - 1,
        className: "group relative p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-110 disabled:hover:scale-100",
        title: "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u0433\u043B\u0430\u0432\u0430"
      },
      /* @__PURE__ */ React.createElement(SkipForward, { size: 16, className: "group-hover:scale-110 transition-transform" })
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => seekTo(Math.min(duration, currentTime + 15)),
        className: "group relative p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm hover:scale-110",
        title: "\u0412\u043F\u0435\u0440\u0435\u0434 \u043D\u0430 15 \u0441\u0435\u043A"
      },
      /* @__PURE__ */ React.createElement(SkipForward, { size: 18, className: "group-hover:scale-110 transition-transform" }),
      /* @__PURE__ */ React.createElement("span", { className: "absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" }, "+15\u0441")
    )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Volume2, { className: "text-gray-300", size: 16 }), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "0",
        max: "1",
        step: "0.1",
        value: volume,
        onChange: (e) => {
          const newVolume = Number(e.target.value);
          setVolume(newVolume);
          if (audioRef.current) {
            audioRef.current.volume = newVolume;
          }
        },
        className: "w-24"
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-gray-300 text-sm" }, Math.round(volume * 100), "%")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-gray-300 text-sm" }, "\u0421\u043A\u043E\u0440\u043E\u0441\u0442\u044C:"), /* @__PURE__ */ React.createElement(
      "select",
      {
        value: playbackRate,
        onChange: (e) => {
          const rate = Number(e.target.value);
          setPlaybackRate(rate);
          if (audioRef.current) {
            audioRef.current.playbackRate = rate;
          }
        },
        className: "bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      },
      /* @__PURE__ */ React.createElement("option", { value: "0.5", className: "bg-gray-800" }, "0.5x"),
      /* @__PURE__ */ React.createElement("option", { value: "0.75", className: "bg-gray-800" }, "0.75x"),
      /* @__PURE__ */ React.createElement("option", { value: "1", className: "bg-gray-800" }, "1x"),
      /* @__PURE__ */ React.createElement("option", { value: "1.25", className: "bg-gray-800" }, "1.25x"),
      /* @__PURE__ */ React.createElement("option", { value: "1.5", className: "bg-gray-800" }, "1.5x"),
      /* @__PURE__ */ React.createElement("option", { value: "2", className: "bg-gray-800" }, "2x")
    )), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-gray-300 text-sm" }, "\u041A\u0430\u0447\u0435\u0441\u0442\u0432\u043E:"), /* @__PURE__ */ React.createElement("div", { className: "text-white text-xs" }, chapter.size ? formatFileSize(chapter.size) : "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6" }, /* @__PURE__ */ React.createElement("h4", { className: "text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4" }, "\u0413\u043B\u0430\u0432\u044B (", selectedBook.chapters.length, ")"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 max-h-48 sm:max-h-64 overflow-y-auto" }, selectedBook.chapters.map((ch, index) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: index,
        onClick: () => setCurrentChapter(index),
        className: `w-full text-left p-2 sm:p-3 rounded-lg transition-colors touch-target ${index === currentChapter ? "bg-purple-500/30 text-purple-100 border border-purple-500/50" : "bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "font-medium text-sm sm:text-base truncate" }, ch.title), /* @__PURE__ */ React.createElement("div", { className: "text-xs opacity-75" }, "\u0413\u043B\u0430\u0432\u0430 ", index + 1, ch.size && /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, " \u2022 ", formatFileSize(ch.size)))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, index === currentChapter && isPlaying && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "w-1 h-3 bg-green-400 rounded animate-pulse" }), /* @__PURE__ */ React.createElement("div", { className: "w-1 h-2 bg-green-400 rounded animate-pulse delay-75" }), /* @__PURE__ */ React.createElement("div", { className: "w-1 h-4 bg-green-400 rounded animate-pulse delay-150" })), ch.url.startsWith("blob:") ? /* @__PURE__ */ React.createElement(Upload, { className: "text-blue-400", size: 16 }) : /* @__PURE__ */ React.createElement(Link, { className: "text-green-400", size: 16 })))
    )))));
  };
  const renderImportExportModal = () => {
    if (!showImportExportModal) return null;
    const backupInfo = LibraryManager.generateBackupInfo(books, readingStats, bookmarks);
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 sm:p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Download, { className: "text-green-400", size: 24 }), "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u043E\u0439"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowImportExportModal(false),
        className: "text-gray-400 hover:text-white transition-colors"
      },
      /* @__PURE__ */ React.createElement(X, { size: 24 })
    )), importExportProgress && /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-xl p-4 mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-white font-medium" }, importExportProgress.status === "exporting" ? "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438" : importExportProgress.status === "importing" ? "\u0418\u043C\u043F\u043E\u0440\u0442 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438" : importExportProgress.status === "completed" ? "\u041E\u043F\u0435\u0440\u0430\u0446\u0438\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430" : "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0438"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, (importExportProgress.status === "exporting" || importExportProgress.status === "importing") && /* @__PURE__ */ React.createElement(Loader, { className: "animate-spin text-blue-400", size: 16 }), importExportProgress.status === "completed" && /* @__PURE__ */ React.createElement(Check, { className: "text-green-400", size: 16 }), importExportProgress.status === "error" && /* @__PURE__ */ React.createElement(AlertCircle, { className: "text-red-400", size: 16 }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-300" }, importExportProgress.progress, "%"))), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-gray-700 rounded-full h-2 mb-2" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `h-2 rounded-full transition-all duration-300 ${importExportProgress.status === "error" ? "bg-red-500" : importExportProgress.status === "completed" ? "bg-green-500" : "bg-blue-500"}`,
        style: { width: `${importExportProgress.progress}%` }
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, importExportProgress.message)), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-lg font-semibold text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Upload, { className: "text-blue-400", size: 20 }), "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438"), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-xl p-4" }, /* @__PURE__ */ React.createElement("h5", { className: "text-white font-medium mb-3" }, "\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430:"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "text-gray-300" }, backupInfo.summary), backupInfo.details.map((detail, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "text-gray-400" }, detail)))), /* @__PURE__ */ React.createElement("div", { className: "bg-green-500/10 rounded-xl p-4 border border-green-500/20" }, /* @__PURE__ */ React.createElement("h5", { className: "text-green-300 font-medium mb-2" }, "\u0427\u0442\u043E \u0431\u0443\u0434\u0435\u0442 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E:"), /* @__PURE__ */ React.createElement("ul", { className: "text-green-200 text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0412\u0441\u0435 \u043A\u043D\u0438\u0433\u0438 \u0441 \u043F\u043E\u043B\u043D\u044B\u043C \u0442\u0435\u043A\u0441\u0442\u043E\u043C"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435 (\u0430\u0432\u0442\u043E\u0440, \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435, \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435)"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0421\u0441\u044B\u043B\u043A\u0438 \u043D\u0430 \u043E\u0431\u043B\u043E\u0436\u043A\u0438 \u0438 \u0430\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B\u044B"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0447\u0442\u0435\u043D\u0438\u044F \u043F\u043E \u043A\u0430\u0436\u0434\u043E\u0439 \u043A\u043D\u0438\u0433\u0435"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0412\u0441\u0435 \u0437\u0430\u043A\u043B\u0430\u0434\u043A\u0438 \u0441 \u0437\u0430\u043C\u0435\u0442\u043A\u0430\u043C\u0438"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F \u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F"))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleExportLibrary,
        disabled: books.length === 0 || importExportProgress?.status === "exporting",
        className: "w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      },
      /* @__PURE__ */ React.createElement(Download, { size: 20 }),
      "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0443"
    ), lastExportInfo && /* @__PURE__ */ React.createElement("div", { className: "bg-green-500/10 rounded-lg p-3 border border-green-500/20" }, /* @__PURE__ */ React.createElement("div", { className: "text-green-300 text-sm" }, /* @__PURE__ */ React.createElement("div", null, "\u2705 \u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u044D\u043A\u0441\u043F\u043E\u0440\u0442: ", lastExportInfo.fileName), /* @__PURE__ */ React.createElement("div", null, "\u{1F4DA} \u041A\u043D\u0438\u0433: ", lastExportInfo.booksCount), /* @__PURE__ */ React.createElement("div", null, "\u{1F516} \u0417\u0430\u043A\u043B\u0430\u0434\u043E\u043A: ", lastExportInfo.bookmarksCount), /* @__PURE__ */ React.createElement("div", null, "\u{1F4E6} \u0420\u0430\u0437\u043C\u0435\u0440: ", (lastExportInfo.size / 1024).toFixed(1), " KB")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-lg font-semibold text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Upload, { className: "text-purple-400", size: 20 }), "\u0418\u043C\u043F\u043E\u0440\u0442 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438"), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-xl p-4" }, /* @__PURE__ */ React.createElement("h5", { className: "text-white font-medium mb-3" }, "\u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F \u0438\u043C\u043F\u043E\u0440\u0442\u0430:"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 cursor-pointer" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "importStrategy",
        value: "merge",
        checked: importStrategy === "merge",
        onChange: (e) => setImportStrategy(e.target.value),
        className: "text-purple-500"
      }
    ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-white text-sm" }, "\u041E\u0431\u044A\u0435\u0434\u0438\u043D\u0438\u0442\u044C"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-xs" }, "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u044B\u0435 \u043A\u043D\u0438\u0433\u0438 \u043A \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u043C"))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 cursor-pointer" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "importStrategy",
        value: "replace",
        checked: importStrategy === "replace",
        onChange: (e) => setImportStrategy(e.target.value),
        className: "text-purple-500"
      }
    ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-white text-sm" }, "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-xs" }, "\u041F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u0437\u0430\u043C\u0435\u043D\u0438\u0442\u044C \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0443"))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 cursor-pointer" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "radio",
        name: "importStrategy",
        value: "keep-existing",
        checked: importStrategy === "keep-existing",
        onChange: (e) => setImportStrategy(e.target.value),
        className: "text-purple-500"
      }
    ), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-white text-sm" }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-xs" }, "\u041D\u0435 \u0438\u0437\u043C\u0435\u043D\u044F\u0442\u044C \u0442\u0435\u043A\u0443\u0449\u0443\u044E \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0443"))))), /* @__PURE__ */ React.createElement("div", { className: "border-2 border-dashed border-purple-500/50 rounded-xl p-6 text-center hover:border-purple-500 transition-colors" }, /* @__PURE__ */ React.createElement(Upload, { className: "mx-auto text-purple-400 mb-4", size: 48 }), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 text-sm mb-4" }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u0430\u0439\u043B \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0430 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438 (.json)"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => document.getElementById("library-import")?.click(),
        disabled: importExportProgress?.status === "importing",
        className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      },
      "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0444\u0430\u0439\u043B"
    )), /* @__PURE__ */ React.createElement("div", { className: "bg-orange-500/10 rounded-xl p-4 border border-orange-500/20" }, /* @__PURE__ */ React.createElement("h5", { className: "text-orange-300 font-medium mb-2" }, "\u26A0\uFE0F \u0412\u043D\u0438\u043C\u0430\u043D\u0438\u0435:"), /* @__PURE__ */ React.createElement("ul", { className: "text-orange-200 text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u0443\u044E \u043A\u043E\u043F\u0438\u044E \u043F\u0435\u0440\u0435\u0434 \u0438\u043C\u043F\u043E\u0440\u0442\u043E\u043C"), /* @__PURE__ */ React.createElement("li", null, '\u2022 \u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F "\u0417\u0430\u043C\u0435\u043D\u0438\u0442\u044C" \u0443\u0434\u0430\u043B\u0438\u0442 \u0442\u0435\u043A\u0443\u0449\u0438\u0435 \u0434\u0430\u043D\u043D\u044B\u0435'), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0418\u043C\u043F\u043E\u0440\u0442 \u043C\u043E\u0436\u0435\u0442 \u0437\u0430\u043D\u044F\u0442\u044C \u0432\u0440\u0435\u043C\u044F \u0434\u043B\u044F \u0431\u043E\u043B\u044C\u0448\u0438\u0445 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0444\u0430\u0439\u043B\u044B \u0438\u0437 \u044D\u0442\u043E\u0433\u043E \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F"))))), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "library-import",
        type: "file",
        accept: ".json",
        onChange: handleImportLibrary,
        className: "hidden"
      }
    ))));
  };
  const renderUploadModal = () => {
    if (!showUploadModal) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white" }, uploadType === "file" ? "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043D\u0438\u0433\u0438" : "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0430\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0443"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowUploadModal(false),
        className: "text-gray-400 hover:text-white transition-colors"
      },
      /* @__PURE__ */ React.createElement(X, { size: 24 })
    )), uploadType === "file" ? /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "border-2 border-dashed border-purple-500/50 rounded-xl p-8 hover:border-purple-500 transition-colors" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "mx-auto text-purple-400 mb-4", size: 48 }), /* @__PURE__ */ React.createElement("h4", { className: "text-white font-semibold mb-2" }, "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u0435 \u0444\u0430\u0439\u043B\u044B \u043A\u043D\u0438\u0433"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 text-sm mb-4" }, "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0435 \u0444\u043E\u0440\u043C\u0430\u0442\u044B: FB2, TXT"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => fileInputRef.current?.click(),
        className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300"
      },
      "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0444\u0430\u0439\u043B\u044B"
    ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-xl p-4" }, /* @__PURE__ */ React.createElement("h5", { className: "text-white font-medium mb-2" }, "\u{1F680} \u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u0430\u0440\u0441\u0435\u0440\u0430:"), /* @__PURE__ */ React.createElement("ul", { className: "text-gray-300 text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F9E0} \u0418\u043D\u0442\u0435\u043B\u043B\u0435\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u043A\u043E\u0434\u0438\u0440\u043E\u0432\u043A\u0438"), " - \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 UTF-8/16, Windows-1251, KOI8-R, CP866 \u0438 \u0434\u0440\u0443\u0433\u0438\u0445"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F50D} BOM \u0434\u0435\u0442\u0435\u043A\u0446\u0438\u044F"), " - \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u0432\u0430\u043D\u0438\u0435 Byte Order Mark"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F4CA} \u0413\u043B\u0443\u0431\u043E\u043A\u043E\u0435 \u0438\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u0435 \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0445"), " - \u0430\u0432\u0442\u043E\u0440, \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435, \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435, \u0436\u0430\u043D\u0440\u044B, ISBN, \u0438\u0437\u0434\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E, \u0441\u0435\u0440\u0438\u0438"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F527} \u041C\u043D\u043E\u0433\u043E\u0443\u0440\u043E\u0432\u043D\u0435\u0432\u043E\u0435 \u0440\u0430\u0437\u0431\u0438\u0435\u043D\u0438\u0435 \u043D\u0430 \u0433\u043B\u0430\u0432\u044B"), " - \u0441\u0435\u043C\u0430\u043D\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439, \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u043D\u044B\u0439 \u0438 \u0440\u0430\u0437\u043C\u0435\u0440\u043D\u044B\u0439 \u0430\u043D\u0430\u043B\u0438\u0437"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u2728 \u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u0430\u044F \u043E\u0447\u0438\u0441\u0442\u043A\u0430 \u0442\u0435\u043A\u0441\u0442\u0430"), " - \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0441\u043B\u0443\u0436\u0435\u0431\u043D\u043E\u0439 \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u0438, \u043D\u043E\u0440\u043C\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F, HTML/XML"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F30D} \u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u0435 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u044F\u0437\u044B\u043A\u0430"), " - \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 7+ \u044F\u0437\u044B\u043A\u043E\u0432 \u0441 \u0430\u043D\u0430\u043B\u0438\u0437\u043E\u043C \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0430"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F3AF} \u0414\u0435\u0442\u0435\u043A\u0446\u0438\u044F \u0436\u0430\u043D\u0440\u043E\u0432"), " - \u044D\u0432\u0440\u0438\u0441\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0430\u043D\u0430\u043B\u0438\u0437 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E \u043F\u043E \u043A\u043B\u044E\u0447\u0435\u0432\u044B\u043C \u0441\u043B\u043E\u0432\u0430\u043C"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F4E6} \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0430\u0440\u0445\u0438\u0432\u043D\u044B\u0445 \u0444\u043E\u0440\u043C\u0430\u0442\u043E\u0432"), " - EPUB \u043A\u0430\u043A ZIP, DOCX \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B, \u0441\u043B\u043E\u0436\u043D\u044B\u0435 XML"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F4DA} FB2 \u0441 \u043F\u043E\u043B\u043D\u043E\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u043E\u0439"), " - \u0441\u0435\u043A\u0446\u0438\u0438, \u043F\u043E\u0434\u0441\u0435\u043A\u0446\u0438\u0438, \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0447\u0438\u043A\u0438, \u0441\u0435\u0440\u0438\u0438, \u0430\u043D\u043D\u043E\u0442\u0430\u0446\u0438\u0438"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F4C4} \u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0439 PDF \u043F\u0430\u0440\u0441\u0435\u0440"), " - \u0438\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u0435 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0445 \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u0432, \u043F\u043E\u0442\u043E\u043A\u043E\u0432, \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0445"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F4DD} RTF \u0441 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u0439 \u043E\u0447\u0438\u0441\u0442\u043A\u043E\u0439"), " - Unicode, \u043A\u043E\u043C\u0430\u043D\u0434\u044B \u0444\u043E\u0440\u043C\u0430\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F, \u0433\u0440\u0443\u043F\u043F\u044B"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F52C} \u0421\u0435\u043C\u0430\u043D\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0430\u043D\u0430\u043B\u0438\u0437"), " - \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0441\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u044B \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430 \u043F\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u044E"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u2705 \u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430"), " - \u0430\u043D\u0430\u043B\u0438\u0437 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430, \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438, \u043E\u0446\u0435\u043D\u043A\u0430 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u0438"), /* @__PURE__ */ React.createElement("li", null, "\u2022 ", /* @__PURE__ */ React.createElement("strong", null, "\u{1F6E1}\uFE0F \u0412\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u044F \u0438 \u043F\u043E\u0441\u0442\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430"), " - \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0446\u0435\u043B\u043E\u0441\u0442\u043D\u043E\u0441\u0442\u0438, \u0444\u0438\u043B\u044C\u0442\u0440\u0430\u0446\u0438\u044F \u043E\u0448\u0438\u0431\u043E\u043A"))), /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        multiple: true,
        accept: ".txt,.fb2,.epub,.doc,.docx,.mobi,.pdf,.rtf",
        onChange: handleFileUpload,
        className: "hidden"
      }
    )) : /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-white font-semibold" }, "\u{1F4C1} \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0444\u0430\u0439\u043B\u043E\u0432"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: audioBookTitle,
        onChange: (e) => setAudioBookTitle(e.target.value),
        placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0430\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0438",
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "\u0410\u0432\u0442\u043E\u0440"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: audioBookAuthor,
        onChange: (e) => setAudioBookAuthor(e.target.value),
        placeholder: "\u0410\u0432\u0442\u043E\u0440",
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "border-2 border-dashed border-blue-500/50 rounded-xl p-6 text-center hover:border-blue-500 transition-colors" }, /* @__PURE__ */ React.createElement(Headphones, { className: "mx-auto text-blue-400 mb-4", size: 48 }), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 text-sm mb-4" }, "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0435 \u0444\u043E\u0440\u043C\u0430\u0442\u044B: MP3, WAV, OGG, M4A"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => document.getElementById("audio-upload")?.click(),
        className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300"
      },
      "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0430\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B\u044B"
    ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h4", { className: "text-white font-semibold" }, "\u{1F517} \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0430\u043C"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: audioBookTitle,
        onChange: (e) => setAudioBookTitle(e.target.value),
        placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0430\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433\u0438",
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "\u0410\u0432\u0442\u043E\u0440"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: audioBookAuthor,
        onChange: (e) => setAudioBookAuthor(e.target.value),
        placeholder: "\u0410\u0432\u0442\u043E\u0440",
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "MP3 \u0441\u0441\u044B\u043B\u043A\u0438 (\u043F\u043E \u043E\u0434\u043D\u043E\u0439 \u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0443)"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: audioUrls,
        onChange: (e) => setAudioUrls(e.target.value),
        placeholder: `https://example.com/chapter1.mp3
https://example.com/chapter2.mp3
https://example.com/chapter3.mp3`,
        rows: 6,
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleAudioUrlsLoad,
        disabled: !audioUrls.trim(),
        className: "w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      },
      "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0430\u043C"
    ))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-xl p-4" }, /* @__PURE__ */ React.createElement("h5", { className: "text-white font-medium mb-2" }, "\u{1F3A7} \u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u0441\u0438\u0441\u0442\u0435\u043C\u044B \u0430\u0443\u0434\u0438\u043E\u043A\u043D\u0438\u0433:"), /* @__PURE__ */ React.createElement("ul", { className: "text-gray-300 text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041C\u0430\u0441\u0441\u043E\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0433\u043B\u0430\u0432 \u043F\u043E MP3 \u0441\u0441\u044B\u043B\u043A\u0430\u043C"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E\u0441\u0442\u0438 \u0444\u0430\u0439\u043B\u043E\u0432"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0440\u0430\u0437\u043B\u0438\u0447\u043D\u044B\u0445 \u0430\u0443\u0434\u0438\u043E\u0444\u043E\u0440\u043C\u0430\u0442\u043E\u0432"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438 \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u044F (0.5x - 2x)"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0417\u0430\u043A\u043B\u0430\u0434\u043A\u0438 \u0441 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u043E\u0439 \u043A\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0433\u043B\u0430\u0432"))), /* @__PURE__ */ React.createElement(
      "input",
      {
        id: "audio-upload",
        type: "file",
        multiple: true,
        accept: "audio/*",
        onChange: handleAudioUpload,
        className: "hidden"
      }
    )))));
  };
  const renderAIChat = () => /* @__PURE__ */ React.createElement("div", { className: `fixed top-0 right-0 bottom-0 w-full sm:w-96 max-w-sm bg-gray-900/95 sm:bg-white/10 sm:dark:bg-gray-900/50 backdrop-blur-lg border-l border-white/20 transform transition-transform duration-300 z-50 ${aiChatOpen ? "translate-x-0" : "translate-x-full"}` }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-full" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 sm:p-4 border-b border-white/20" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(Brain, { className: "text-white", size: 14 })), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-white text-sm sm:text-base truncate" }, "\u0418\u0418 \u041F\u043E\u043C\u043E\u0449\u043D\u0438\u043A"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-400 truncate" }, "\u0413\u043E\u0442\u043E\u0432 \u043F\u043E\u043C\u043E\u0447\u044C \u0441 \u043A\u043D\u0438\u0433\u0430\u043C\u0438"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 sm:gap-2 flex-shrink-0" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: openApiKeyModal,
      className: `p-1.5 sm:p-2 rounded-lg transition-colors ${aiAssistantRef.current?.apiKey ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`,
      title: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 API \u043A\u043B\u044E\u0447\u0430"
    },
    /* @__PURE__ */ React.createElement(Settings, { size: 14 })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: toggleAITTS,
      className: `p-1.5 sm:p-2 rounded-lg transition-colors ${localStorage.getItem("aiTtsEnabled") !== "false" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`,
      title: `${localStorage.getItem("aiTtsEnabled") !== "false" ? "\u041E\u0442\u043A\u043B\u044E\u0447\u0438\u0442\u044C" : "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C"} \u043E\u0437\u0432\u0443\u0447\u043A\u0443 \u043E\u0442\u0432\u0435\u0442\u043E\u0432`
    },
    /* @__PURE__ */ React.createElement(Volume2, { size: 14 })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: stopAIVoice,
      className: "p-1.5 sm:p-2 text-red-400 hover:text-red-300 transition-colors",
      title: "\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0437\u0432\u0443\u0447\u043A\u0443"
    },
    /* @__PURE__ */ React.createElement(VolumeX, { size: 14 })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiChatOpen(false),
      className: "text-gray-400 hover:text-white transition-colors p-1"
    },
    /* @__PURE__ */ React.createElement(X, { size: 18 })
  )))), /* @__PURE__ */ React.createElement("div", { className: "p-4 bg-white/5 border-b border-white/20" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400 space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "API \u0441\u0442\u0430\u0442\u0443\u0441:"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: openApiKeyModal,
      className: `font-medium transition-colors ${aiAssistantRef.current?.apiKey ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"}`,
      title: "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u0434\u043B\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 API \u043A\u043B\u044E\u0447\u0430"
    },
    aiAssistantRef.current?.apiKey ? "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D" : "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C"
  )), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "\u041E\u0431\u0443\u0447\u0430\u044E\u0449\u0438\u0445 \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439:"), /* @__PURE__ */ React.createElement("span", { className: "text-white font-medium" }, aiAssistantRef.current?.getStatistics().totalInteractions || 0)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "\u0421\u0435\u0433\u043E\u0434\u043D\u044F:"), /* @__PURE__ */ React.createElement("span", { className: "text-white font-medium" }, aiAssistantRef.current?.getStatistics().todayInteractions || 0)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "\u0422\u043E\u0447\u043D\u043E\u0441\u0442\u044C \u043E\u0442\u0432\u0435\u0442\u043E\u0432:"), /* @__PURE__ */ React.createElement("span", { className: "text-white font-medium" }, Math.round((aiAssistantRef.current?.getStatistics().accuracy || 0) * 100), "%")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", null, "\u0410\u0432\u0442\u043E\u043E\u0437\u0432\u0443\u0447\u043A\u0430:"), /* @__PURE__ */ React.createElement("span", { className: `font-medium ${localStorage.getItem("aiTtsEnabled") !== "false" ? "text-green-400" : "text-red-400"}` }, localStorage.getItem("aiTtsEnabled") !== "false" ? "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u0430" : "\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u0430")), !aiAssistantRef.current?.apiKey && /* @__PURE__ */ React.createElement("div", { className: "mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-300 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", null, "\u26A0\uFE0F \u0414\u043B\u044F \u0418\u0418 \u0444\u0443\u043D\u043A\u0446\u0438\u0439 \u043D\u0443\u0436\u0435\u043D API \u043A\u043B\u044E\u0447"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: openApiKeyModal,
      className: "bg-yellow-500/20 hover:bg-yellow-500/30 px-2 py-1 rounded text-yellow-200 transition-colors"
    },
    "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C"
  ))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1 flex-wrap" }, /* @__PURE__ */ React.createElement("span", null, "\u041A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0442\u0435\u043C\u044B:"), aiAssistantRef.current?.getStatistics().topKeywords.slice(0, 3).map(([word]) => /* @__PURE__ */ React.createElement("span", { key: word, className: "px-1 py-0.5 bg-purple-500/20 rounded text-purple-300 text-xs" }, word))))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4" }, aiMessages.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center text-gray-400 py-8" }, /* @__PURE__ */ React.createElement(Brain, { className: "mx-auto mb-2", size: 32 }), /* @__PURE__ */ React.createElement("p", null, "\u041F\u0440\u0438\u0432\u0435\u0442! \u042F \u0432\u0430\u0448 \u0443\u043C\u043D\u044B\u0439 \u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A."), /* @__PURE__ */ React.createElement("p", { className: "text-sm mt-1" }, "\u041C\u043E\u0433\u0443 \u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043D\u0438\u0433\u0438, \u0434\u0430\u0432\u0430\u0442\u044C \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438 \u0438 \u043E\u0442\u0432\u0435\u0447\u0430\u0442\u044C \u043D\u0430 \u0432\u043E\u043F\u0440\u043E\u0441\u044B."), !aiAssistantRef.current?.apiKey ? /* @__PURE__ */ React.createElement("div", { className: "mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2 text-red-300" }, /* @__PURE__ */ React.createElement(AlertCircle, { size: 16 }), /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F API \u043A\u043B\u044E\u0447")), /* @__PURE__ */ React.createElement("p", { className: "text-red-200 text-sm mb-3" }, "\u0414\u043B\u044F \u0440\u0430\u0431\u043E\u0442\u044B \u0418\u0418 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C API \u043A\u043B\u044E\u0447 OpenRouter"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: openApiKeyModal,
      className: "bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg transition-colors font-medium"
    },
    "\u{1F511} \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C API \u043A\u043B\u044E\u0447"
  )) : /* @__PURE__ */ React.createElement("div", { className: "mt-4 space-y-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiInput("\u041F\u0440\u043E\u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0439 \u043C\u043E\u044E \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0443"),
      className: "block w-full text-left px-3 py-2 bg-purple-500/20 text-purple-300 text-sm rounded hover:bg-purple-500/30 transition-colors"
    },
    "\u{1F4CA} \u0410\u043D\u0430\u043B\u0438\u0437 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiInput("\u0427\u0442\u043E \u043C\u043D\u0435 \u043F\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0434\u0430\u043B\u044C\u0448\u0435?"),
      className: "block w-full text-left px-3 py-2 bg-blue-500/20 text-blue-300 text-sm rounded hover:bg-blue-500/30 transition-colors"
    },
    "\u{1F4DA} \u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiInput("\u041F\u043E\u043A\u0430\u0436\u0438 \u043C\u043E\u044E \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443 \u0447\u0442\u0435\u043D\u0438\u044F"),
      className: "block w-full text-left px-3 py-2 bg-green-500/20 text-green-300 text-sm rounded hover:bg-green-500/30 transition-colors"
    },
    "\u{1F4C8} \u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430"
  ))), aiMessages.map((message, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: message.timestamp || index,
      className: `flex ${message.type === "user" ? "justify-end" : "justify-start"}`
    },
    /* @__PURE__ */ React.createElement("div", { className: `max-w-[80%] p-3 rounded-lg relative ${message.type === "user" ? "bg-purple-500 text-white" : "bg-white/10 text-gray-100"}` }, /* @__PURE__ */ React.createElement("div", { className: "text-sm whitespace-pre-wrap" }, message.content), message.type === "ai" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mt-2 pt-2 border-t border-white/10" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, message.isPlaying && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "w-1 h-3 bg-green-400 rounded animate-pulse" }), /* @__PURE__ */ React.createElement("div", { className: "w-1 h-2 bg-green-400 rounded animate-pulse delay-75" }), /* @__PURE__ */ React.createElement("div", { className: "w-1 h-4 bg-green-400 rounded animate-pulse delay-150" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-green-400 ml-1" }, "\u041E\u0437\u0432\u0443\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044F..."))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => speakAIResponse(message.content, message.id),
        disabled: message.isPlaying,
        className: "p-1 text-green-400 hover:text-green-300 transition-colors disabled:opacity-50",
        title: "\u041E\u0437\u0432\u0443\u0447\u0438\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435"
      },
      /* @__PURE__ */ React.createElement(Volume2, { size: 12 })
    ), message.isPlaying && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: stopAIVoice,
        className: "p-1 text-red-400 hover:text-red-300 transition-colors",
        title: "\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0437\u0432\u0443\u0447\u043A\u0443"
      },
      /* @__PURE__ */ React.createElement(VolumeX, { size: 12 })
    ))), message.source && /* @__PURE__ */ React.createElement("div", { className: "text-xs opacity-75 mt-1 flex items-center gap-1" }, message.source === "learning" && /* @__PURE__ */ React.createElement(Brain, { size: 12 }), message.source === "book" && /* @__PURE__ */ React.createElement(BookOpen, { size: 12 }), message.source === "internet" && /* @__PURE__ */ React.createElement(Search, { size: 12 }), message.source === "analysis" && /* @__PURE__ */ React.createElement(TrendingUp, { size: 12 }), "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A: ", message.source === "learning" ? "\u043E\u0431\u0443\u0447\u0435\u043D\u0438\u0435" : message.source === "book" ? "\u043A\u043D\u0438\u0433\u0430" : message.source === "internet" ? "\u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442" : message.source === "analysis" ? "\u0430\u043D\u0430\u043B\u0438\u0437" : "\u0441\u0438\u0441\u0442\u0435\u043C\u0430"), message.confidence && /* @__PURE__ */ React.createElement("div", { className: "text-xs opacity-75 mt-1" }, "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C: ", Math.round(message.confidence * 100), "%"), message.suggestions && /* @__PURE__ */ React.createElement("div", { className: "mt-2 space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs opacity-75" }, "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043F\u0440\u043E\u0441\u0438\u0442\u044C:"), message.suggestions.map((suggestion, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        onClick: () => setAiInput(suggestion),
        className: "block text-xs text-left w-full px-2 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
      },
      suggestion
    ))), message.relatedQuestions && message.relatedQuestions.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mt-2 space-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs opacity-75" }, "\u041F\u043E\u0445\u043E\u0436\u0438\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B:"), message.relatedQuestions.map((question, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: i,
        onClick: () => setAiInput(question),
        className: "block text-xs text-left w-full px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors"
      },
      question
    ))))
  )), aiLoading && /* @__PURE__ */ React.createElement("div", { className: "flex justify-start" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 text-gray-100 p-3 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin" }, /* @__PURE__ */ React.createElement(RefreshCw, { size: 16 })), /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, "\u0410\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u044E \u0438 \u0434\u0443\u043C\u0430\u044E..."))))), /* @__PURE__ */ React.createElement("div", { className: "p-3 sm:p-4 border-t border-white/20" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: aiInput,
      onChange: (e) => setAiInput(e.target.value),
      onKeyPress: (e) => e.key === "Enter" && !e.shiftKey && handleAIMessage(),
      placeholder: aiAssistantRef.current?.apiKey ? "\u0417\u0430\u0434\u0430\u0439\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441..." : "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 API \u043A\u043B\u044E\u0447",
      disabled: !aiAssistantRef.current?.apiKey,
      className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleAIMessage,
      disabled: !aiInput.trim() || aiLoading || !aiAssistantRef.current?.apiKey,
      className: "p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
    },
    /* @__PURE__ */ React.createElement(Send, { size: 16 })
  )), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1 sm:gap-2 flex-wrap" }, aiAssistantRef.current?.apiKey ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiInput("\u041F\u0440\u043E\u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0439 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u043C\u043E\u0438\u0445 \u043A\u043D\u0438\u0433"),
      className: "px-2 py-1 bg-white/5 text-gray-300 text-xs rounded hover:bg-white/10 transition-colors"
    },
    "\u0410\u043D\u0430\u043B\u0438\u0437"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiInput("\u041F\u043E\u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0439 \u0447\u0442\u043E \u043F\u043E\u0447\u0438\u0442\u0430\u0442\u044C"),
      className: "px-2 py-1 bg-white/5 text-gray-300 text-xs rounded hover:bg-white/10 transition-colors"
    },
    "\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0430\u0446\u0438\u0438"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiInput("\u041F\u043E\u043A\u0430\u0436\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443"),
      className: "px-2 py-1 bg-white/5 text-gray-300 text-xs rounded hover:bg-white/10 transition-colors"
    },
    "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430"
  )) : /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: openApiKeyModal,
      className: "px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded hover:bg-red-500/30 transition-colors font-medium"
    },
    "\u{1F511} \u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C API \u043A\u043B\u044E\u0447"
  )))));
  const renderApiKeyModal = () => {
    if (!showApiKeyModal) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Settings, { className: "text-purple-400", size: 24 }), "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 API \u043A\u043B\u044E\u0447\u0430"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowApiKeyModal(false),
        className: "text-gray-400 hover:text-white transition-colors"
      },
      /* @__PURE__ */ React.createElement(X, { size: 24 })
    )), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "OpenRouter API \u043A\u043B\u044E\u0447"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        value: tempApiKey,
        onChange: (e) => setTempApiKey(e.target.value),
        placeholder: "sk-or-v1-...",
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "mt-2 text-xs text-gray-400" }, "\u041A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0438 \u043D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u0435\u0442\u0441\u044F \u0442\u0440\u0435\u0442\u044C\u0438\u043C \u043B\u0438\u0446\u0430\u043C")), /* @__PURE__ */ React.createElement("div", { className: "bg-blue-500/10 rounded-xl p-4 border border-blue-500/20" }, /* @__PURE__ */ React.createElement("h4", { className: "text-blue-300 font-medium mb-2" }, "\u{1F511} \u041A\u0430\u043A \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C API \u043A\u043B\u044E\u0447:"), /* @__PURE__ */ React.createElement("ol", { className: "text-blue-200 text-sm space-y-1 list-decimal list-inside" }, /* @__PURE__ */ React.createElement("li", null, "\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043D\u0430 ", /* @__PURE__ */ React.createElement("a", { href: "https://openrouter.ai", target: "_blank", rel: "noopener noreferrer", className: "text-blue-300 hover:text-blue-200 underline" }, "openrouter.ai")), /* @__PURE__ */ React.createElement("li", null, "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C \u0438\u043B\u0438 \u0432\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 \u0430\u043A\u043A\u0430\u0443\u043D\u0442"), /* @__PURE__ */ React.createElement("li", null, '\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u0432 \u0440\u0430\u0437\u0434\u0435\u043B "API Keys"'), /* @__PURE__ */ React.createElement("li", null, "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043A\u043B\u044E\u0447"), /* @__PURE__ */ React.createElement("li", null, "\u0421\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u0438 \u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0435\u0433\u043E \u0441\u044E\u0434\u0430"))), /* @__PURE__ */ React.createElement("div", { className: "bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20" }, /* @__PURE__ */ React.createElement("h4", { className: "text-yellow-300 font-medium mb-2" }, "\u{1F4A1} \u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F:"), /* @__PURE__ */ React.createElement("ul", { className: "text-yellow-200 text-sm space-y-1" }, /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043C\u043E\u0434\u0435\u043B\u044C: ", /* @__PURE__ */ React.createElement("code", { className: "bg-black/20 px-1 rounded" }, "qwen/qwq-32b:free")), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0435 \u043C\u043E\u0434\u0435\u043B\u0438 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0431\u0435\u0437 \u043E\u043F\u043B\u0430\u0442\u044B"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041A\u043B\u044E\u0447 \u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u0432\u0430\u0448\u0435\u043C \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435"), /* @__PURE__ */ React.createElement("li", null, "\u2022 \u041C\u043E\u0436\u043D\u043E \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0432 \u043B\u044E\u0431\u043E\u0435 \u0432\u0440\u0435\u043C\u044F"))), aiAssistantRef.current?.apiKey && /* @__PURE__ */ React.createElement("div", { className: "bg-green-500/10 rounded-xl p-4 border border-green-500/20" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(Check, { className: "text-green-400", size: 16 }), /* @__PURE__ */ React.createElement("span", { className: "text-green-300 font-medium" }, "API \u043A\u043B\u044E\u0447 \u0430\u043A\u0442\u0438\u0432\u0435\u043D")), /* @__PURE__ */ React.createElement("div", { className: "text-green-200 text-sm" }, "\u041A\u043B\u044E\u0447: \u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", aiAssistantRef.current.apiKey.slice(-8)))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 mt-6" }, aiAssistantRef.current?.apiKey && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleRemoveApiKey,
        className: "flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 rounded-lg transition-colors font-medium"
      },
      "\u{1F5D1}\uFE0F \u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u043B\u044E\u0447"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowApiKeyModal(false),
        className: "flex-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 py-2 rounded-lg transition-colors"
      },
      "\u041E\u0442\u043C\u0435\u043D\u0430"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSaveApiKey,
        disabled: !tempApiKey.trim(),
        className: "flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      },
      "\u{1F4BE} \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C"
    )))));
  };
  const renderEditModal = () => {
    if (!showEditModal || !editingBook) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white" }, "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043D\u0438\u0433\u0438"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowEditModal(false),
        className: "text-gray-400 hover:text-white transition-colors"
      },
      /* @__PURE__ */ React.createElement(X, { size: 24 })
    )), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: editingBook.title,
        onChange: (e) => setEditingBook({ ...editingBook, title: e.target.value }),
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "\u0410\u0432\u0442\u043E\u0440"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: editingBook.author,
        onChange: (e) => setEditingBook({ ...editingBook, author: e.target.value }),
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: editingBook.description || "",
        onChange: (e) => setEditingBook({ ...editingBook, description: e.target.value }),
        rows: 3,
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-white text-sm font-medium mb-2" }, "\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u043E\u0431\u043B\u043E\u0436\u043A\u0443"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "url",
        value: editingBook.cover,
        onChange: (e) => setEditingBook({ ...editingBook, cover: e.target.value }),
        placeholder: "https://example.com/cover.jpg",
        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    ), editingBook.cover && /* @__PURE__ */ React.createElement("div", { className: "mt-2 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: editingBook.cover,
        alt: "\u041F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440",
        className: "w-16 h-20 object-cover rounded",
        onError: (e) => {
          e.target.style.display = "none";
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setEditingBook({ ...editingBook, cover: "" }),
        className: "text-red-400 hover:text-red-300 transition-colors"
      },
      "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C"
    )))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h4", { className: "text-lg font-semibold text-white mb-4" }, "\u0413\u043B\u0430\u0432\u044B \u043A\u043D\u0438\u0433\u0438"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 max-h-96 overflow-y-auto" }, editingBook.chapters?.map((chapter, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "bg-white/5 rounded-lg p-4 border border-white/10" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-white font-medium" }, "\u0413\u043B\u0430\u0432\u0430 ", index + 1), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          const newChapters = editingBook.chapters.filter((_, i) => i !== index);
          setEditingBook({ ...editingBook, chapters: newChapters });
        },
        className: "text-red-400 hover:text-red-300 transition-colors"
      },
      /* @__PURE__ */ React.createElement(Trash2, { size: 16 })
    )), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: chapter.title,
        onChange: (e) => {
          const newChapters = [...editingBook.chapters];
          newChapters[index] = { ...chapter, title: e.target.value };
          setEditingBook({ ...editingBook, chapters: newChapters });
        },
        placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0433\u043B\u0430\u0432\u044B",
        className: "w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    ), editingBook.type === "text" ? /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: chapter.content,
        onChange: (e) => {
          const newChapters = [...editingBook.chapters];
          newChapters[index] = { ...chapter, content: e.target.value };
          setEditingBook({ ...editingBook, chapters: newChapters });
        },
        placeholder: "\u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0433\u043B\u0430\u0432\u044B",
        rows: 4,
        className: "w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    ) : /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "url",
        value: chapter.url,
        onChange: (e) => {
          const newChapters = [...editingBook.chapters];
          newChapters[index] = { ...chapter, url: e.target.value };
          setEditingBook({ ...editingBook, chapters: newChapters });
        },
        placeholder: "URL \u0430\u0443\u0434\u0438\u043E\u0444\u0430\u0439\u043B\u0430",
        className: "w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      }
    ), editingBook.type === "text" && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "\u0421\u0438\u043C\u0432\u043E\u043B\u043E\u0432: ", chapter.content?.length || 0), editingBook.type === "audio" && chapter.size && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, "\u0420\u0430\u0437\u043C\u0435\u0440: ", formatFileSize(chapter.size))))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          const newChapter = editingBook.type === "text" ? { title: `\u0413\u043B\u0430\u0432\u0430 ${editingBook.chapters.length + 1}`, content: "" } : { title: `\u0413\u043B\u0430\u0432\u0430 ${editingBook.chapters.length + 1}`, url: "", size: 0 };
          setEditingBook({
            ...editingBook,
            chapters: [...editingBook.chapters || [], newChapter]
          });
        },
        className: "w-full p-3 border-2 border-dashed border-purple-500/50 text-purple-300 rounded-lg hover:border-purple-500 hover:text-purple-200 transition-colors"
      },
      "+ \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0433\u043B\u0430\u0432\u0443"
    ))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setBooks((prev) => prev.filter((b) => b.id !== editingBook.id));
          setShowEditModal(false);
        },
        className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      },
      "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u043D\u0438\u0433\u0443"
    ), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowEditModal(false),
        className: "px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      },
      "\u041E\u0442\u043C\u0435\u043D\u0430"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setBooks((prev) => prev.map((b) => b.id === editingBook.id ? editingBook : b));
          setShowEditModal(false);
        },
        className: "px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      },
      "\u{1F4BE} \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F"
    ))))));
  };
  const renderStatsModal = () => {
    if (!showStatsModal) return null;
    const stats = calculateStats();
    const insights = recommendationEngineRef.current?.getReadingInsights(books, readingStats) || [];
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement(TrendingUp, { className: "text-green-400", size: 24 }), "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0447\u0442\u0435\u043D\u0438\u044F"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowStatsModal(false),
        className: "text-gray-400 hover:text-white transition-colors"
      },
      /* @__PURE__ */ React.createElement(X, { size: 24 })
    )), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "text-purple-400", size: 24 }), /* @__PURE__ */ React.createElement("h4", { className: "text-purple-300 font-semibold" }, "\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430")), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, stats.totalBooks), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "\u0412\u0441\u0435\u0433\u043E \u043A\u043D\u0438\u0433"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-purple-300 mt-2" }, stats.booksInProgress, " \u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435, ", stats.completedBooks, " \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E")), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(Trophy, { className: "text-green-400", size: 24 }), /* @__PURE__ */ React.createElement("h4", { className: "text-green-300 font-semibold" }, "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441")), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, Math.round(stats.completedBooks / Math.max(stats.totalBooks, 1) * 100), "%"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043D\u044B\u0445 \u043A\u043D\u0438\u0433"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-green-300 mt-2" }, stats.completedBooks, " \u0438\u0437 ", stats.totalBooks)), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(Bookmark, { className: "text-blue-400", size: 24 }), /* @__PURE__ */ React.createElement("h4", { className: "text-blue-300 font-semibold" }, "\u0417\u0430\u043A\u043B\u0430\u0434\u043A\u0438")), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, stats.totalBookmarks), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E \u043C\u043E\u043C\u0435\u043D\u0442\u043E\u0432"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-blue-300 mt-2" }, "\u0412 ", Object.keys(bookmarks).length, " \u043A\u043D\u0438\u0433\u0430\u0445")), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(Activity, { className: "text-yellow-400", size: 24 }), /* @__PURE__ */ React.createElement("h4", { className: "text-yellow-300 font-semibold" }, "\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C")), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, stats.readingStreak), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "\u0414\u043D\u0435\u0439 \u043F\u043E\u0434\u0440\u044F\u0434"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-yellow-300 mt-2" }, "\u042D\u0442\u043E\u0442 \u043C\u0435\u0441\u044F\u0446: ", stats.booksThisMonth, " \u043A\u043D\u0438\u0433")), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-500/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(FileText, { className: "text-indigo-400", size: 24 }), /* @__PURE__ */ React.createElement("h4", { className: "text-indigo-300 font-semibold" }, "\u041E\u0431\u044A\u0435\u043C")), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, Math.round(stats.totalWords / 1e3), "K"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "\u0421\u043B\u043E\u0432 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-indigo-300 mt-2" }, "\u2248 ", Math.round(stats.totalWords / 200), " \u043C\u0438\u043D\u0443\u0442 \u0447\u0442\u0435\u043D\u0438\u044F")), /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl p-6 border border-red-500/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(Calendar, { className: "text-red-400", size: 24 }), /* @__PURE__ */ React.createElement("h4", { className: "text-red-300 font-semibold" }, "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F")), /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-white mb-1" }, Object.values(achievements).filter(Boolean).length), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-gray-300" }, "\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E"), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-red-300 mt-2" }, "\u0438\u0437 ", Object.keys(achievements).length, " \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445"))), insights.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-xl p-6 mb-6" }, /* @__PURE__ */ React.createElement("h4", { className: "text-lg font-semibold text-white mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Brain, { className: "text-purple-400", size: 20 }), "\u0410\u043D\u0430\u043B\u0438\u0437 \u0432\u0430\u0448\u0438\u0445 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0435\u043D\u0438\u0439"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, insights.map((insight, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex items-start gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" }), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300" }, insight))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded-xl p-6" }, /* @__PURE__ */ React.createElement("h4", { className: "text-lg font-semibold text-white mb-4" }, "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0447\u0442\u0435\u043D\u0438\u044F"), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, books.slice(0, 10).map((book) => {
      const bookStats = readingStats[book.id] || {};
      const progress = bookStats.progress || 0;
      const lastRead = bookStats.lastRead ? new Date(bookStats.lastRead).toLocaleDateString() : "\u041D\u0435 \u0447\u0438\u0442\u0430\u043B";
      return /* @__PURE__ */ React.createElement("div", { key: book.id, className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 mr-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-white font-medium text-sm" }, book.title), /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-xs" }, book.author, " \u2022 ", lastRead), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-gray-700 rounded-full h-2 mt-1" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300",
          style: { width: `${progress}%` }
        }
      ))), /* @__PURE__ */ React.createElement("div", { className: "text-white text-sm font-medium" }, Math.round(progress), "%"));
    }))))));
  };
  const renderAchievementsModal = () => {
    if (!showAchievementsModal) return null;
    const achievementsList = [
      {
        id: "collector",
        name: "\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u043E\u043D\u0435\u0440",
        description: "\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 10 \u043A\u043D\u0438\u0433 \u0432 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0443",
        icon: BookOpen,
        color: "text-blue-400",
        unlocked: achievements.collector
      },
      {
        id: "reader",
        name: "\u0427\u0438\u0442\u0430\u0442\u0435\u043B\u044C",
        description: "\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u0439\u0442\u0435 5 \u043A\u043D\u0438\u0433 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E",
        icon: Trophy,
        color: "text-gold-400",
        unlocked: achievements.reader
      },
      {
        id: "bookmarker",
        name: "\u0417\u0430\u043A\u043B\u0430\u0434\u043E\u0447\u043D\u0438\u043A",
        description: "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 50 \u0437\u0430\u043A\u043B\u0430\u0434\u043E\u043A",
        icon: Bookmark,
        color: "text-yellow-400",
        unlocked: achievements.bookmarker
      },
      {
        id: "active",
        name: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439 \u0447\u0438\u0442\u0430\u0442\u0435\u043B\u044C",
        description: "\u0427\u0438\u0442\u0430\u0439\u0442\u0435 3 \u043A\u043D\u0438\u0433\u0438 \u0432 \u043C\u0435\u0441\u044F\u0446",
        icon: Zap,
        color: "text-orange-400",
        unlocked: achievements.active
      },
      {
        id: "wordMaster",
        name: "\u041C\u0430\u0441\u0442\u0435\u0440 \u0441\u043B\u043E\u0432\u0430",
        description: "\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u0439\u0442\u0435 100,000 \u0441\u043B\u043E\u0432",
        icon: Target,
        color: "text-purple-400",
        unlocked: achievements.wordMaster
      },
      {
        id: "consistent",
        name: "\u041F\u043E\u0441\u0442\u043E\u044F\u043D\u0441\u0442\u0432\u043E",
        description: "\u0427\u0438\u0442\u0430\u0439\u0442\u0435 7 \u0434\u043D\u0435\u0439 \u043F\u043E\u0434\u0440\u044F\u0434",
        icon: Medal,
        color: "text-green-400",
        unlocked: achievements.consistent
      }
    ];
    const unlockedCount = achievementsList.filter((a) => a.unlocked).length;
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Award, { className: "text-yellow-400", size: 24 }), "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowAchievementsModal(false),
        className: "text-gray-400 hover:text-white transition-colors"
      },
      /* @__PURE__ */ React.createElement(X, { size: 24 })
    )), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-white font-medium" }, "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u0439"), /* @__PURE__ */ React.createElement("span", { className: "text-gray-300" }, unlockedCount, "/", achievementsList.length)), /* @__PURE__ */ React.createElement("div", { className: "w-full bg-gray-700 rounded-full h-3" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-300",
        style: { width: `${unlockedCount / achievementsList.length * 100}%` }
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-4" }, achievementsList.map((achievement) => {
      const Icon = achievement.icon;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: achievement.id,
          className: `rounded-xl p-6 border transition-all duration-300 ${achievement.unlocked ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30" : "bg-white/5 border-white/10"}`
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: `p-3 rounded-full ${achievement.unlocked ? "bg-yellow-500/20" : "bg-gray-700/50"}` }, /* @__PURE__ */ React.createElement(
          Icon,
          {
            className: achievement.unlocked ? achievement.color : "text-gray-500",
            size: 24
          }
        )), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-1" }, /* @__PURE__ */ React.createElement("h4", { className: `font-semibold ${achievement.unlocked ? "text-white" : "text-gray-400"}` }, achievement.name), achievement.unlocked && /* @__PURE__ */ React.createElement(Crown, { className: "text-yellow-400", size: 16 })), /* @__PURE__ */ React.createElement("p", { className: `text-sm ${achievement.unlocked ? "text-gray-300" : "text-gray-500"}` }, achievement.description), achievement.unlocked && /* @__PURE__ */ React.createElement("div", { className: "text-xs text-yellow-400 mt-1 font-medium" }, "\u2728 \u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E!")))
      );
    })), unlockedCount === achievementsList.length && /* @__PURE__ */ React.createElement("div", { className: "mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30 text-center" }, /* @__PURE__ */ React.createElement(Crown, { className: "mx-auto text-yellow-400 mb-2", size: 32 }), /* @__PURE__ */ React.createElement("h4", { className: "text-xl font-bold text-white mb-1" }, "\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C!"), /* @__PURE__ */ React.createElement("p", { className: "text-yellow-300" }, "\u0412\u044B \u0440\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043B\u0438 \u0432\u0441\u0435 \u0434\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F!")))));
  };
  const renderBookmarksModal = () => {
    if (!showBookmarksModal) return null;
    const allBookmarks = Object.entries(bookmarks).flatMap(
      ([bookId, bookmarkList]) => bookmarkList.map((bookmark) => ({
        ...bookmark,
        book: books.find((b) => b.id === bookId)
      }))
    ).sort((a, b) => b.timestamp - a.timestamp);
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Bookmark, { className: "text-yellow-400", size: 24 }), "\u0417\u0430\u043A\u043B\u0430\u0434\u043A\u0438 (", allBookmarks.length, ")"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowBookmarksModal(false),
        className: "text-gray-400 hover:text-white transition-colors"
      },
      /* @__PURE__ */ React.createElement(X, { size: 24 })
    )), allBookmarks.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-12" }, /* @__PURE__ */ React.createElement(Bookmark, { className: "mx-auto text-gray-400 mb-4", size: 64 }), /* @__PURE__ */ React.createElement("h4", { className: "text-xl font-semibold text-gray-300 mb-2" }, "\u041D\u0435\u0442 \u0437\u0430\u043A\u043B\u0430\u0434\u043E\u043A"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-400" }, "\u0421\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u043F\u0435\u0440\u0432\u0443\u044E \u0437\u0430\u043A\u043B\u0430\u0434\u043A\u0443 \u0432\u043E \u0432\u0440\u0435\u043C\u044F \u0447\u0442\u0435\u043D\u0438\u044F")) : /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, allBookmarks.map((bookmark) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: bookmark.id,
        className: "bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer",
        onClick: () => goToBookmark(bookmark)
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "text-white font-medium" }, bookmark.book?.title || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043A\u043D\u0438\u0433\u0430"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 text-sm" }, bookmark.book?.author || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0430\u0432\u0442\u043E\u0440")), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-gray-400" }, new Date(bookmark.timestamp).toLocaleDateString())),
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 mb-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-gray-300" }, bookmark.type === "audio" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Headphones, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, "\u0413\u043B\u0430\u0432\u0430 ", bookmark.chapterIndex + 1), bookmark.audioTime && /* @__PURE__ */ React.createElement("span", null, "\u2022 ", formatTime(bookmark.audioTime))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(BookOpen, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, "\u0413\u043B\u0430\u0432\u0430 ", bookmark.chapterIndex + 1), bookmark.sentenceIndex && /* @__PURE__ */ React.createElement("span", null, "\u2022 \u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 ", bookmark.sentenceIndex + 1)))),
      bookmark.note && /* @__PURE__ */ React.createElement("div", { className: "bg-white/5 rounded p-3 text-sm text-gray-200" }, '"', bookmark.note, '"'),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            setBookmarks((prev) => ({
              ...prev,
              [bookmark.bookId]: prev[bookmark.bookId].filter((b) => b.id !== bookmark.id)
            }));
          },
          className: "mt-2 text-red-400 hover:text-red-300 transition-colors text-sm"
        },
        "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0437\u0430\u043A\u043B\u0430\u0434\u043A\u0443"
      )
    ))))));
  };
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen transition-all duration-300 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" }, /* @__PURE__ */ React.createElement("nav", { className: "bg-gray-900/50 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto px-2 sm:px-4 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between h-14 sm:h-16" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 sm:gap-2 min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0" }, /* @__PURE__ */ React.createElement(BookOpen, { className: "text-white", size: 12 })), /* @__PURE__ */ React.createElement("span", { className: "text-xs sm:text-sm lg:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate" }, "BookReader Pro")), selectedBook && /* @__PURE__ */ React.createElement("div", { className: "hidden xl:flex items-center gap-2 mx-4 min-w-0" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setCurrentView(selectedBook.type === "audio" ? "audio" : "reader"),
      className: `px-3 py-1.5 rounded-lg transition-colors text-sm whitespace-nowrap ${currentView === "reader" || currentView === "audio" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"}`
    },
    selectedBook.type === "audio" ? "\u{1F3A7} \u0410\u0443\u0434\u0438\u043E\u043F\u043B\u0435\u0435\u0440" : "\u{1F4D6} \u0427\u0438\u0442\u0430\u043B\u043A\u0430"
  )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-0.5 sm:gap-1 lg:gap-2 flex-shrink-0" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setCurrentView("library"),
      className: `p-1 sm:p-1.5 lg:p-2 transition-colors touch-target ${currentView === "library" ? "text-purple-400" : "text-gray-400 hover:text-white"}`,
      title: "\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430"
    },
    /* @__PURE__ */ React.createElement(BookOpen, { size: 14, className: "sm:hidden" }),
    /* @__PURE__ */ React.createElement(BookOpen, { size: 16, className: "hidden sm:block lg:hidden" }),
    /* @__PURE__ */ React.createElement(BookOpen, { size: 20, className: "hidden lg:block" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowBookmarksModal(true),
      className: "p-1 sm:p-1.5 lg:p-2 text-gray-400 hover:text-white transition-colors relative touch-target",
      title: "\u0417\u0430\u043A\u043B\u0430\u0434\u043A\u0438"
    },
    /* @__PURE__ */ React.createElement(Bookmark, { size: 14, className: "sm:hidden" }),
    /* @__PURE__ */ React.createElement(Bookmark, { size: 16, className: "hidden sm:block lg:hidden" }),
    /* @__PURE__ */ React.createElement(Bookmark, { size: 20, className: "hidden lg:block" }),
    Object.values(bookmarks).flat().length > 0 && /* @__PURE__ */ React.createElement("div", { className: "absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" }, Object.values(bookmarks).flat().length > 99 ? "99+" : Object.values(bookmarks).flat().length)
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setAiChatOpen(!aiChatOpen),
      className: `p-1 sm:p-1.5 lg:p-2 transition-colors touch-target ${aiChatOpen ? "text-purple-400" : "text-gray-400 hover:text-white"}`,
      title: "\u0418\u0418 \u041F\u043E\u043C\u043E\u0449\u043D\u0438\u043A"
    },
    /* @__PURE__ */ React.createElement(Brain, { size: 14, className: "sm:hidden" }),
    /* @__PURE__ */ React.createElement(Brain, { size: 16, className: "hidden sm:block lg:hidden" }),
    /* @__PURE__ */ React.createElement(Brain, { size: 20, className: "hidden lg:block" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowStatsModal(true),
      className: "hidden md:block p-1 sm:p-1.5 lg:p-2 text-gray-400 hover:text-white transition-colors touch-target",
      title: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430"
    },
    /* @__PURE__ */ React.createElement(TrendingUp, { size: 16, className: "lg:hidden" }),
    /* @__PURE__ */ React.createElement(TrendingUp, { size: 20, className: "hidden lg:block" })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowAchievementsModal(true),
      className: "hidden md:block p-1 sm:p-1.5 lg:p-2 text-gray-400 hover:text-white transition-colors touch-target",
      title: "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F"
    },
    /* @__PURE__ */ React.createElement(Award, { size: 16, className: "lg:hidden" }),
    /* @__PURE__ */ React.createElement(Award, { size: 20, className: "hidden lg:block" })
  ))))), /* @__PURE__ */ React.createElement("main", { className: "max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8" }, currentView === "library" && renderLibrary(), currentView === "reader" && renderReader(), currentView === "audio" && renderAudioPlayer()), renderAIChat(), renderUploadModal(), renderImportExportModal(), renderApiKeyModal(), renderEditModal(), renderStatsModal(), renderAchievementsModal(), renderBookmarksModal());
};
var stdin_default = LiquidGlassLibrary;
export {
  stdin_default as default
};
