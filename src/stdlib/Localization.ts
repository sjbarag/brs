import * as fs from "fs";
import * as path from "path";
import pSettle from "p-settle";
import { promisify } from "util";
const readFile = promisify(fs.readFile);

import { Interpreter } from "../interpreter";
import { BrsString, Callable, ValueKind, StdlibArgument, RoDeviceInfo } from "../brsTypes";
import { XmlDocument } from "xmldoc";

/**
 * Supported locales in RBI.
 * @see https://developer.roku.com/docs/references/brightscript/interfaces/ifdeviceinfo.md#getcurrentlocale-as-string
 */
let locales = new Set<string>([
    "en_US", // US English
    "en_GB", // British English
    "fr_CA", // Canadian French
    "es_ES", // International Spanish
    "de_DE", // German
    "it_IT", // Italian
    "pt_BR", // Brazilian Portuguese
]);

/** Source string to translated string */
type Translations = Map<string, string>;

/** File names to translation maps */
let fileTranslations = new Map<string, Translations>();

/**
 * Parses and stores the actual translations of a given XML file.
 * @param xmlNode The XmlDocument node that represents this translation file
 * @param locale The locale for this translation file
 */
function parseTranslations(xmlNode: XmlDocument, locale: string) {
    let translations: Translations = new Map();
    let contextNode = xmlNode.childNamed("context");
    contextNode?.childrenNamed("message").forEach((messageElement) => {
        let source = messageElement.childNamed("source");
        let translation = messageElement.childNamed("translation");
        if (source && translation) {
            translations.set(source.val, translation.val);
        }
    });

    fileTranslations.set(locale, translations);
}

/**
 * Finds and records all of the translation files that exist in the locale/ folder.
 * @param rootDir The root package directory
 */
export async function loadTranslationFiles(interpreter: Interpreter, rootDir: string) {
    await pSettle(
        Array.from(locales).map(async (locale) => {
            const filePath = path.join(rootDir, "locale", locale, "translations.ts");
            if (fs.existsSync(filePath)) {
                let xmlNode: XmlDocument;
                try {
                    let contents = await readFile(filePath, "utf-8");
                    let xmlStr = contents.toString().replace(/\r?\n|\r/g, "");
                    xmlNode = new XmlDocument(xmlStr);
                    parseTranslations(xmlNode, locale);
                } catch (err) {
                    interpreter.stderr.write(`Error reading translations file ${filePath}: ${err}`);
                }
            }
        })
    );
}

export const Tr = new Callable("Tr", {
    signature: {
        returns: ValueKind.String,
        args: [new StdlibArgument("source", ValueKind.String)],
    },
    impl: (_: Interpreter, source: BrsString) => {
        let locale = RoDeviceInfo.locale;
        let translationFile = fileTranslations.get(locale);
        let translatedString = translationFile?.get(source.value);

        if (translatedString) {
            return new BrsString(translatedString);
        }

        // If there was no translation found, RBI returns the input string.
        return source;
    },
});
