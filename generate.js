const fs = require("fs-extra");
const Handlebars = require("handlebars");
const path = require("path");

(async () => {
    try {
        // Diretórios
        const imagesDir = path.join(__dirname, "docs", "images"); // Alterado para docs/images
        const templateFile = path.join(__dirname, "docs", "templates", "index.hbs"); // Alterado para docs/templates
        const outputFile = path.join(__dirname, "docs", "index.html"); // Alterado para docs

        // Listar imagens no diretório
        const imageFiles = await fs.readdir(imagesDir);

        // Organizar as imagens em pares desktop e mobile
        const images = imageFiles
            .filter((file) => file.includes("desktop"))
            .map((desktopFile) => {
                const mobileFile = desktopFile.replace("desktop", "mobile");
                return {
                    type: "desktop",
                    src: path.join("images", desktopFile),
                    mobileSrc: path.join("images", mobileFile),
                    alt: desktopFile.replace("_", " ").replace(".jpg", ""),
                };
            });

        // Ler template
        const templateContent = await fs.readFile(templateFile, "utf8");
        const template = Handlebars.compile(templateContent);

        // Adicionar helper para condicional
        Handlebars.registerHelper("ifCond", function (v1, v2, options) {
            return v1 === v2 ? options.fn(this) : options.inverse(this);
        });

        // Gerar HTML
        const html = template({ images });
        await fs.writeFile(outputFile, html, "utf8");

        console.log("HTML gerado com sucesso em:", outputFile);
    } catch (error) {
        console.error("Erro ao gerar HTML:", error);
    }
})();
