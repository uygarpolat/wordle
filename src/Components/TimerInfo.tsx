import infoIcon from "../Assets/info-icon.svg";
import { infoScreen, Language } from "../Assets/Settings/Settings";

interface TimerInfoProps {
	language: Language;
}

export default function TimerInfo({ language }: TimerInfoProps) {
	return infoScreen(language, infoIcon);
}
